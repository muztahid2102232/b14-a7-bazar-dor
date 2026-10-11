import Link from "next/link";
import { notFound } from "next/navigation";

const API_BASE = "https://openapi.programming-hero.com/api/bazardor";

interface MarketPrice {
  market: string;
  division: string;
  min: number;
  max: number;
}

interface Product {
  id: number | string;
  slug?: string;
  nameBn: string;
  name?: string;
  category?: string;
  categoryNameBn?: string;
  categoryIcon?: string;
  unit?: string;
  today: number;
  yesterday?: number;
  lastWeek?: number;
  lastMonth?: number;
  change?: {
    dir: "up" | "down" | "flat";
    pct: number;
  };
  description?: string;
  markets: MarketPrice[];
}

const bnNumber = new Intl.NumberFormat("bn-BD", {
  maximumFractionDigits: 2,
});

function PriceSummary({
  title,
  price,
  unit,
  color,
}: {
  title: string;
  price: number;
  unit: string;
  color: string;
}) {
  return (
    <div className="rounded-xl border border-[#E0E9E2] p-3">
      <p className="text-[11px] text-[#737D75]">{title}</p>

      <p className={`mt-1 text-lg font-bold ${color}`}>
        {bnNumber.format(price)} টাকা
      </p>

      <p className="text-[10px] text-[#737D75]">প্রতি {unit}</p>
    </div>
  );
}

function formatUnit(unit?: string) {
  const units: Record<string, string> = {
    kg: "কেজি",
    g: "গ্রাম",
    liter: "লিটার",
    litre: "লিটার",
    l: "লিটার",
    piece: "পিস",
    dozen: "ডজন",
  };

  if (!unit) return "একক";

  return units[unit.toLowerCase()] ?? unit;
}

async function getProduct(id: string): Promise<Product | null> {
  if (!/^\d+$/.test(id)) {
    return null;
  }

  const response = await fetch(
    `${API_BASE}/products/${encodeURIComponent(id)}`,
    {
      cache: "no-store",
    },
  );

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error("পণ্যের তথ্য লোড করা যায়নি।");
  }

  const result: unknown = await response.json();

  if (typeof result !== "object" || result === null) {
    throw new Error("API থেকে সঠিক পণ্যের তথ্য পাওয়া যায়নি।");
  }

  const record = result as Record<string, unknown>;

  // Support either a direct product or { data: product }.
  const product = ("data" in record ? record.data : result) as Product | null;

  if (!product || typeof product !== "object") {
    return null;
  }

  // Avoid showing the wrong product if the response is unexpected.
  if (product.id !== undefined && String(product.id) !== id) {
    return null;
  }

  if (!Array.isArray(product.markets)) {
    product.markets = [];
  }

  return product;
}

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  const name = product.nameBn ?? product.name ?? "পণ্যের নাম";
  const unit = formatUnit(product.unit);
  const marketRows = product.markets;

  // Calculate statistics from each market's actual min and max.
  const marketPrices = marketRows.flatMap((market) =>
    [market.min, market.max].filter(
      (price) => typeof price === "number" && Number.isFinite(price),
    ),
  );

  const minPrice =
    marketPrices.length > 0 ? Math.min(...marketPrices) : product.today;

  const maxPrice =
    marketPrices.length > 0 ? Math.max(...marketPrices) : product.today;

  const averagePrice =
    marketPrices.length > 0
      ? Math.ceil(marketPrices.reduce((total, price) =>total + price, 0) /
        marketPrices.length)
      : product.today;

  const direction = product.change?.dir ?? "flat";

  const changeColor =
    direction === "up"
      ? "text-red-500"
      : direction === "down"
        ? "text-emerald-600"
        : "text-gray-600";

  return (
    <main className="min-h-screen bg-[#F0F5F0] px-4 py-5 sm:px-6 lg:py-8">
      <div className="mx-auto max-w-6xl space-y-3">
        {/* Product summary */}
        <section className="flex items-center justify-between gap-4 rounded-xl border border-[#E0E9E2] bg-[#FAFCFA] p-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[#EDF4EF] text-2xl">
              {product.categoryIcon || "🛒"}
            </div>

            <div className="min-w-0">
              <h1 className="text-lg font-bold sm:text-xl">{name}</h1>

              <p className="text-xs text-[#858D87]">
                প্রতি {unit}
                {product.categoryNameBn ? ` · ${product.categoryNameBn}` : ""}
              </p>

              <p className="mt-1 text-xs text-[#59655D]">
                {product.description ?? "আজকের বাজারদর ও দামের পরিবর্তন"}
              </p>
            </div>
          </div>

          <div className="shrink-0 rounded-xl bg-[#F0F5F0] px-3 py-2 text-center">
            <p className="text-[10px] text-[#737D75]">আজকের দাম</p>

            <p className="text-xl font-bold">
              {bnNumber.format(product.today)}
            </p>

            <p className="text-xs text-[#737D75]">টাকা / {unit}</p>

            <p className={`mt-1 text-[10px] font-semibold ${changeColor}`}>
              {direction === "up" ? "▲" : direction === "down" ? "▼" : "—"}{" "}
              {bnNumber.format(Math.abs(product.change?.pct ?? 0))}%
            </p>
          </div>
        </section>

        {/* Price summary */}
        <section className="rounded-xl border border-[#E0E9E2] bg-[#FAFCFA] p-3">
          <h2 className="mb-3 text-sm font-bold">দামের সারসংক্ষেপ</h2>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            <PriceSummary
              title="সর্বনিম্ন দাম"
              price={minPrice}
              unit={unit}
              color="text-emerald-600"
            />

            <PriceSummary
              title="সর্বোচ্চ দাম"
              price={maxPrice}
              unit={unit}
              color="text-red-500"
            />

            <PriceSummary
              title="গড় দাম"
              price={averagePrice}
              unit={unit}
              color="text-[#40893F]"
            />
          </div>
        </section>

        {/* Market-by-market prices */}
        <section className="rounded-xl border border-[#E0E9E2] bg-[#FAFCFA] p-3">
          <h2 className="mb-3 text-sm font-bold">বাজারভিত্তিক আজকের দাম</h2>

          {marketRows.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] border-collapse text-left text-xs">
                <thead>
                  <tr className="border-y border-[#E2EAE4] text-[#69756D]">
                    <th className="p-2 font-medium">বাজার</th>
                    <th className="p-2 font-medium">বিভাগ</th>
                    <th className="p-2 text-right font-medium">সর্বনিম্ন</th>
                    <th className="p-2 text-right font-medium">সর্বোচ্চ</th>
                    <th className="p-2 text-right font-medium">গড়</th>
                  </tr>
                </thead>

                <tbody>
                  {marketRows.map((market, index) => {
                    const marketName = market.market ?? `বাজার ${index + 1}`;

                    const marketAverage = Math.ceil((market.min + market.max) / 2);

                    return (
                      <tr
                        key={`${marketName}-${index}`}
                        className={
                          index % 2 === 0
                            ? "border-b border-[#DDE5DF] bg-[#F0F5F0]"
                            : "border-b border-[#DDE5DF]"
                        }
                      >
                        <td className="p-2">{marketName}</td>

                        <td className="p-2">{market.division ?? "—"}</td>

                        <td className="p-2 text-right">
                          {bnNumber.format(market.min)} টাকা
                        </td>

                        <td className="p-2 text-right">
                          {bnNumber.format(market.max)} টাকা
                        </td>

                        <td className="p-2 text-right font-semibold">
                          {bnNumber.format(marketAverage)} টাকা
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="py-5 text-center text-xs text-[#7A847D]">
              এই পণ্যের বাজারভিত্তিক দামের তালিকা পাওয়া যায়নি।
            </p>
          )}
        </section>

        <Link
          href="/"
          className="inline-flex rounded-lg bg-[#40893F] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#327432]"
        >
          ← হোম পেজে ফিরে যান
        </Link>
      </div>
    </main>
  );
}




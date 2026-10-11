"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";

interface ProductChange {
  dir: "up" | "down" | "flat";
  pct: number;
}

interface RiceProduct {
  id: string;
  nameBn: string;
  category: string;
  categoryNameBn: string;
  categoryIcon: string;
  unit: string;
  image: string;
  today: number;
  yesterday: number;
  lastWeek: number;
  lastMonth: number;
  change: ProductChange;
}

interface ApiResponse {
  status?: boolean;
  message?: string;
  data?: RiceProduct[];
}

type SortOption = "default" | "low-to-high" | "high-to-low";

const API_BASE = "https://openapi.programming-hero.com/api/bazardor/products";

const bnNumber = new Intl.NumberFormat("bn-BD", {
  maximumFractionDigits: 1,
});

function formatUnit(unit?: string) {
  if (!unit) return "একক";

  const units: Record<string, string> = {
    kg: "কেজি",
    kilogram: "কিলোগ্রাম",
    g: "গ্রাম",
    gram: "গ্রাম",
    liter: "লিটার",
    litre: "লিটার",
    l: "লিটার",
    ml: "মিলিলিটার",
    piece: "পিস",
    pieces: "পিস",
    pcs: "পিস",
    dozen: "ডজন",
    packet: "প্যাকেট",
  };

  return units[unit.toLowerCase()] ?? unit;
}

function formatCategoryName(id: string) {
  const names: Record<string, string> = {
    chal: "চাল",
    dal: "ডাল",
    tel: "তেল",
    mach: "মাছ",
    mangsho: "মাংস",
    sobji: "সবজি",
    fol: "ফল",
    moshla: "মসলা",
  };

  // Use this only when the API doesn't provide a category name.
  return names[id.toLowerCase()] ?? id;
}

export default function CategoryPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [products, setProducts] = useState<RiceProduct[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>("default");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const controller = new AbortController();

    async function fetchProducts() {
      try {
        setLoading(true);
        setError("");
        setProducts([]);

        const response = await fetch(
          `${API_BASE}?category=${encodeURIComponent(id)}`,
          { signal: controller.signal },
        );

        if (!response.ok) {
          throw new Error("পণ্যের তথ্য লোড করা যায়নি।");
        }

        const result: unknown = await response.json();

        // Support either a direct array or an object containing data.
        let items: unknown;

        if (Array.isArray(result)) {
          items = result;
        } else if (
          typeof result === "object" &&
          result !== null &&
          "data" in result
        ) {
          items = (result as ApiResponse).data;
        }

        if (!Array.isArray(items)) {
          throw new Error("API থেকে সঠিক পণ্যের তথ্য পাওয়া যায়নি।");
        }

        setProducts(items as RiceProduct[]);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }

        setError(
          err instanceof Error ? err.message : "কিছু একটা সমস্যা হয়েছে।",
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchProducts();

    return () => controller.abort();
  }, [id]);

  const sortedProducts = useMemo(() => {
    const result = [...products];

    if (sortBy === "low-to-high") {
      result.sort((a, b) => a.today - b.today);
    } else if (sortBy === "high-to-low") {
      result.sort((a, b) => b.today - a.today);
    }

    return result;
  }, [products, sortBy]);

  // Prefer the category name supplied by the API.
  const categoryName = products[0]?.categoryNameBn || formatCategoryName(id);

  const image = products[0]?.image || "🛒";

  return (
    <main className="min-h-screen bg-[#eef5f0] px-4 py-5 text-[#202b25] sm:px-6 lg:px-[60px]">
      <div className="mx-auto max-w-[1440px] space-y-5">
        {/* Category header */}
        <section className="flex min-h-[82px] items-center gap-3 rounded-2xl border border-[#dce7df] bg-[#fafcfb] px-5 py-4">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#eef4ef] text-2xl">
            {image}
          </div>

          <div>
            <h1 className="text-xl font-bold">{categoryName}</h1>
            <p className="text-xs text-[#778078]">
              {bnNumber.format(products.length)}টি পণ্যের আজকের দাম ও পরিবর্তন
            </p>
          </div>
        </section>

        {/* Sorting toolbar */}
        <section className="flex min-h-[59px] items-center justify-end rounded-2xl border border-[#dce7df] bg-[#fafcfb] px-5 py-3">
          <label
            htmlFor="sort-products"
            className="mr-2 text-sm text-[#737d75]"
          >
            সাজান
          </label>

          <select
            id="sort-products"
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value as SortOption)}
            className="cursor-pointer rounded-lg border border-[#d2dcd4] bg-transparent px-3 py-1.5 text-sm outline-none focus:border-green-600"
          >
            <option value="default">ডিফল্ট</option>
            <option value="low-to-high">দাম: কম থেকে বেশি</option>
            <option value="high-to-low">দাম: বেশি থেকে কম</option>
          </select>
        </section>

        {/* Product count */}
        <p className="text-xs text-[#69766d]">
          {loading
            ? "পণ্যের তথ্য লোড হচ্ছে..."
            : `মোট ${bnNumber.format(sortedProducts.length)}টি পণ্য দেখানো হচ্ছে`}
        </p>

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-[122px] animate-pulse rounded-2xl border border-[#dce7df] bg-white/70 p-4"
              >
                <div className="mb-4 h-10 w-40 rounded-lg bg-gray-200" />
                <div className="h-5 w-24 rounded bg-gray-200" />
              </div>
            ))}
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <section className="rounded-2xl border border-red-200 bg-white p-6 text-center">
            <p className="text-sm text-red-600">{error}</p>

            <button
              onClick={() => window.location.reload()}
              className="mt-3 rounded-lg bg-green-700 px-4 py-2 text-sm text-white"
            >
              আবার চেষ্টা করুন
            </button>
          </section>
        )}

        {/* Product cards */}
        {!loading && !error && sortedProducts.length > 0 && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {sortedProducts.map((product) => {
              const direction = product.change?.dir ?? "flat";
              const percentage = product.change?.pct ?? 0;

              const changeStyle =
                direction === "up"
                  ? "bg-[#f0f5f1] text-red-500"
                  : direction === "down"
                    ? "bg-[#f0f5f1] text-emerald-600"
                    : "bg-[#f0f5f1] text-gray-700";

              return (
                <article
                  key={product.id}
                  className="relative min-h-[122px] rounded-2xl border border-[#dce7df] bg-[#fafcfb] p-3.5 transition-shadow hover:shadow-sm"
                >
                  {/* Product name and icon */}
                  <div className="flex items-center gap-2.5">
                    <div className="flex size-[43px] shrink-0 items-center justify-center rounded-xl bg-[#eef4ef] text-2xl">
                      {product.image || "🛒"}
                    </div>

                    <div className="min-w-0">
                      <h2 className="truncate text-sm font-bold">
                        {product.nameBn}
                      </h2>
                      <p className="mt-0.5 text-xs text-[#5f6b63]">
                        প্রতি {formatUnit(product.unit)}
                      </p>
                    </div>
                  </div>

                  {/* Today's price */}
                  <div className="mt-2.5">
                    <p className="text-[11px] text-[#6d786f]">আজকের দাম</p>

                    <p className="text-base font-bold leading-6">
                      {bnNumber.format(product.today)}{" "}
                      <span className="text-sm font-normal">টাকা</span>
                    </p>
                  </div>

                  {/* Price change badge */}
                  <div
                    className={`absolute bottom-3.5 right-3.5 flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold ${changeStyle}`}
                  >
                    <span>
                      {direction === "up"
                        ? "▲"
                        : direction === "down"
                          ? "▼"
                          : "—"}
                    </span>

                    <span>{bnNumber.format(Math.abs(percentage))}%</span>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && products.length === 0 && (
          <p className="py-10 text-center text-sm text-gray-500">
            এই বিভাগে কোনো পণ্য পাওয়া যায়নি।
          </p>
        )}
      </div>
    </main>
  );
}

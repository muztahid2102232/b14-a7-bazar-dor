import HeroButton from "@/app/components/HeroButton";
import Image from "next/image";
import Link from "next/link";
import type { IData } from "@/types/ProductType";
import IncreasedPriceCard from "@/app/components/IncreasedPriceCard";
import DecreasedPriceCard from "@/app/components/DecreasedPriceCard";
import AllProductsCard from "@/app/components/AllProductsCard";

const API_URL = "https://openapi.programming-hero.com/api/bazardor/products";

const increasedPricePromise = async (): Promise<IData[]> => {
  const res = await fetch(API_URL);

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  return res.json();
};

export default async function Home() {
  const bnNumber = new Intl.NumberFormat("bn-BD");

  // All products
  const increasedPrices = await increasedPricePromise();

  // Increased prices
  const filteredIncreasedPrices = increasedPrices.filter(
    (price: IData) => price?.change?.dir === "up",
  );

  const sortedFilteredincreasedPrices = [...filteredIncreasedPrices].sort(
    (a: IData, b: IData) => b.change.pct - a.change.pct,
  );

  const slicedIncreasedPrice = sortedFilteredincreasedPrices.slice(0, 6);

  // Decreased prices
  const filteredDecreasedPrices = increasedPrices.filter(
    (price: IData) => price?.change?.dir === "down",
  );

  const sortedFilteredDecreasedPrices = [...filteredDecreasedPrices].sort(
    (a: IData, b: IData) => Math.abs(b.change.pct) - Math.abs(a.change.pct),
  );

  const slicedDecreasedPrice = sortedFilteredDecreasedPrices.slice(0, 6);

  const date = new Intl.DateTimeFormat("bn-BD", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Dhaka",
  }).format(new Date());

  return (
    <>
      {/* Hero section */}
      <div className="bg-[#F0F5F0] py-10">
        <div className="mx-auto flex max-w-6xl gap-14 rounded-3xl bg-[#FAFCFA] p-12">
          <div className="flex flex-col gap-3">
            <p className="self-start rounded-[14px] bg-[#E1F1E7] px-2.5 py-1 text-center font-semibold text-[#40893F]">
              {date}
            </p>

            <h1 className="text-[48px] font-bold">আজকের বাজারের দাম এক নজরে</h1>

            <p className="font-semibold text-[#949A96]">
              চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক
              বিস্তারিত, গড়, সর্বনিম্ন- সর্বাধিক এবং দামের পরিবর্তন এক
              জায়গায়।
            </p>

            <HeroButton />
          </div>

          <div>
            <Image
              width={315}
              height={315}
              alt="hero-image"
              src="/bazar-hero.png"
            />
          </div>
        </div>
      </div>

      {/* Increased price section */}
      <div className="bg-[#F0F5F0]">
        <div className="mx-auto flex max-w-6xl items-center">
          <Image src="/redd.png" alt="red" width={30} height={10} />
          <h3 className="text-[30px] font-semibold">আজ দাম বেড়েছে</h3>
        </div>
      </div>

      <div className="bg-[#F0F5F0] py-10">
        <div className="mx-auto grid max-w-6xl grid-cols-3 gap-3">
          {slicedIncreasedPrice.map((price: IData) => (
            <Link
              key={price.id}
              href={`/product/${price.id}`}
              className="block"
              aria-label={`${price.nameBn} পণ্যের বিস্তারিত দেখুন`}
            >
              <IncreasedPriceCard price={price} />
            </Link>
          ))}
        </div>
      </div>

      {/* Decreased price section */}
      <div className="bg-[#F0F5F0]">
        <div className="mx-auto flex max-w-6xl items-center pb-9">
          <Image src="/green.png" alt="green" width={30} height={10} />
          <h3 className="text-[30px] font-semibold">আজ দাম কমেছে</h3>
        </div>
      </div>

      <div className="bg-[#F0F5F0] py-10">
        <div className="mx-auto grid max-w-6xl grid-cols-3 gap-3">
          {slicedDecreasedPrice.map((price: IData) => (
            <Link
              key={price.id}
              href={`/product/${price.id}`}
              className="block"
              aria-label={`${price.nameBn} পণ্যের বিস্তারিত দেখুন`}
            >
              <DecreasedPriceCard price={price} />
            </Link>
          ))}
        </div>
      </div>

      {/* All products section */}
      <div id="সব-পণ্য" className="bg-[#F0F5F0]">
        <div className="mx-auto max-w-6xl">
          <h3 className="text-[30px] font-semibold">সব পণ্য</h3>
          <p className="font-semibold text-[#949A96]">
            মোট {bnNumber.format(increasedPrices.length)}টি পণ্য দেখানো হচ্ছে
          </p>
        </div>
      </div>

      <div className="bg-[#F0F5F0] py-10">
        <div className="mx-auto grid max-w-6xl grid-cols-3 gap-3">
          {increasedPrices.map((price: IData) => (
            <Link
              key={price.id}
              href={`/product/${price.id}`}
              className="block"
              aria-label={`${price.nameBn} পণ্যের বিস্তারিত দেখুন`}
            >
              <AllProductsCard price={price} />
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

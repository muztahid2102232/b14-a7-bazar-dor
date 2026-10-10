import HeroButton from "@/app/components/HeroButton";
import Image from "next/image";
import type { IData } from "@/types/ProductType";
import IncreasedPriceCard from "@/app/components/IncreasedPriceCard";
import DecreasedPriceCard from "@/app/components/DecreasedPriceCard";
import AllProductsCard from "@/app/components/AllProductsCard";

const increasedPricePromise = async () => {
  const res = await fetch("https://api.abcz.workers.dev/api/bazardor/products");
  return res.json();
};

export default async function Home() {
    const bnNumber = new Intl.NumberFormat("bn-BD");

  // incresed portion
  const increasedPrices = await increasedPricePromise();
  const filteredIncreasedPrices = increasedPrices.filter(
    (price: IData) => price?.change?.dir === "up",
  );
  const sortedFilteredincreasedPrices = filteredIncreasedPrices.sort(
    (a: IData, b: IData) => b?.change?.pct - a?.change?.pct,
  );
  const slicedIncreasedPrice = sortedFilteredincreasedPrices.slice(0, 6);

  // decreased portion

  const filteredDecreasedPrices = increasedPrices.filter(
    (price: IData) => price?.change?.dir === "down",
  );
  const sortedFilteredDecreasedPrices = filteredDecreasedPrices.sort(
    (a: IData, b: IData) => Math.abs(b?.change?.pct) - Math.abs(a?.change?.pct),
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
      <div className="bg-[#F0F5F0] py-10">
        <div className="bg-[#FAFCFA] p-12 rounded-3xl max-w-6xl mx-auto flex gap-14">
          <div className="flex flex-col gap-3">
            <p className="text-[#40893F] font-semibold text-center bg-[#E1F1E7] px-2.5 py-1 rounded-[14px] self-start">
              {date}
            </p>
            <h1 className="font-bold text-[48px]">আজকের বাজারের দাম এক নজরে</h1>
            <p className="text-[#949A96] font-semibold">
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

      {/* todo * Price Increased Section   */}
      <div className="bg-[#F0F5F0]">
        <div className="flex max-w-6xl mx-auto ">
          <Image src="/redd.png" alt="red" width={30} height={10} />
          <h3 className="text-[30px] font-semibold">আজ দাম বেড়েছে</h3>
        </div>
      </div>
      <div className="bg-[#F0F5F0] py-10">
        <div className="max-w-6xl mx-auto grid grid-cols-3 gap-3">
          {slicedIncreasedPrice.map((price: IData) => (
            <IncreasedPriceCard key={price.id} price={price} />
          ))}
        </div>
      </div>
      {/* price decreased section  */}

      <div className="bg-[#F0F5F0]">
        <div className="flex pb-9 max-w-6xl mx-auto ">
          <Image src="/green.png" alt="red" width={30} height={10} />
          <h3 className="text-[30px] font-semibold">আজ দাম কমেছে</h3>
        </div>
      </div>
      <div className="bg-[#F0F5F0] py-10">
        <div className="max-w-6xl mx-auto grid grid-cols-3 gap-3">
          {slicedDecreasedPrice.map((price: IData) => (
            <DecreasedPriceCard key={price.id} price={price} />
          ))}
        </div>
      </div>

      {/* all products section  */}

      <div className="bg-[#F0F5F0]">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-[30px] font-semibold">সব পণ্য</h3>
          <p className="text-[#949A96] font-semibold">
            মোট {bnNumber.format(increasedPrices.length)}টি পণ্য দেখানো হচ্ছে
          </p>
        </div>
      </div>

      <div className="bg-[#F0F5F0] py-10">
        <div className="max-w-6xl mx-auto grid grid-cols-3 gap-3">
          {increasedPrices.map((price: IData) => (
            <AllProductsCard key={price.id} price={price} />
          ))}
        </div>
      </div>
    </>
  );
}

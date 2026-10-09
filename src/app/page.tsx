import HeroButton from "@/app/components/HeroButton";
import Image from "next/image";

export default function Home() {

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
            <h1 className="font-bold text-[36px]">আজকের বাজারের দাম এক নজরে</h1>
            <p className="text-[#949A96] font-semibold">
              চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক
              বিস্তারিত, গড়, সর্বনিম্ন- সর্বাধিক এবং দামের পরিবর্তন এক জায়গায়।
            </p>
<HeroButton/>
          </div>
          <div><Image width={315} height={315} alt="hero-image" src="/bazar-hero.png"/></div>
        </div>
      </div>

      {/* todo * Price Increased Section   */}

    </>
  );
}

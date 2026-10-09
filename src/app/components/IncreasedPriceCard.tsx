import { IData } from "@/types/ProductType";
import { translateUnit } from "@/utils/translateUnit";
import Image from "next/image";


const IncreasedPriceCard = ({ price}:{price:IData}) => {
    const bnNumber = new Intl.NumberFormat("bn-BD");
  return (
    <div className="bg-[#FAFCFA] flex flex-col gap-3.5 p-4 rounded-2xl">
      <div className="flex items-center gap-2.5 flex-start">
        <span className="rounded-xl bg-[#F0F5F0] p-2">{price?.image}</span>
        <div className="flex flex-col">
          <span className="font-extrabold">{price?.nameBn}</span>
          <span>প্রতি {translateUnit(price?.unit)}</span>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <span>আজকের দাম</span>
          <span className="font-bold">{bnNumber.format(price?.today)}টাকা</span>
        </div>
        <div className="flex gap-3 bg-[#F0F5F0] py-2 px-4 rounded-2xl">
          <Image alt="image" width={10} height={10} src="/redd.png" />
          <span className="text-red-500">
            {bnNumber.format(price?.change?.pct)}
          </span>
        </div>
      </div>
    </div>
  );
};
//namBn, unit, pct,today,categoryIcon
export default IncreasedPriceCard;

import Image from "next/image";
import MarqueeText from "react-marquee-text";
import type { IData } from "@/types/ProductType";



const getMarquee = async () => {
  const res = await fetch(
    "https://api.api-store.workers.dev/api/bazardor/products",
  );
  return res.json();
};
const bnNumber = new Intl.NumberFormat("bn-BD");

const Marquee = async () => {
  const marqueeData = await getMarquee();
  const newMarqueeData = marqueeData.filter(
    (data:IData) => data?.change?.dir !== "flat",
  );

  return (
    <MarqueeText direction="right" duration={10} pauseOnHover={true}>
      <div className="flex list-none">
        {newMarqueeData.map((data:IData) => (
          <li key={data?.id}>
            <span>
              {data?.change?.pct > 0? (
                <div className="flex gap-1.5 px-7 py-2.5 border border-slate-300 hover:underline">
                  <div>
                    {" "}
                    <span>{data?.categoryIcon}</span>
                    <span>{data?.nameBn}</span>{" "}
                    <span>{bnNumber.format(data?.today)}টাকা/কেজি</span>
                  </div>

                  <div className="flex gap-1.5">
                    <Image
                      height={13}
                      width={13}
                      alt="green"
                      src="/green-triangle.png"
                    />
                    <p className="text-green-500">{bnNumber.format(data?.change?.pct)}%</p>
                  </div>
                </div>
              ) : (
                <div className="flex gap-1.5 px-7 py-2.5 border border-slate-300 hover:underline ">
                  <div>
                    {" "}
                    <span>{data?.categoryIcon}</span>
                    <span>{data?.nameBn}</span>{" "}
                    <span>{bnNumber.format(data?.today)}টাকা/কেজি</span>
                  </div>
                  <div className="flex gap-1.5">
                    {" "}
                    <Image
                      height={13}
                      width={13}
                      alt="red"
                      src="/red-triangle.png"
                    />{" "}
                    <p className="text-red-500">{bnNumber.format(Math.abs(data?.change?.pct))}%</p>
                  </div>
                </div>
              )}
            </span>
          </li>
        ))}
      </div>
    </MarqueeText>
  );
};
// categoryIcon, nameBn, today;

export default Marquee;

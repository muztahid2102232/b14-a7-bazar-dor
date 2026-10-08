"use client";
import Image from "next/image";
import { useState, useEffect } from "react";

interface ICategory{
    id:string,
    nameBn:string,
    icon:string
}
const Navbar = () => {
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    fetch("https://api.api-store.workers.dev/api/bazardor/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.log(err));
  }, []);
  console.log(categories);
  const date = new Intl.DateTimeFormat("bn-BD", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Dhaka",
  }).format(new Date());

  return (
    <>
      <nav className="bg-[#FAFCFA] flex flex-col gap-4">
        <div>
          {" "}
          <div className=" max-w-6xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-2 ">
              <div>
                <Image
                  className="bg-[#40893F] rounded-xl p-3"
                  width={50}
                  height={40}
                  src="/logo-icon.png"
                  alt="logo-icon"
                />
              </div>
              <div>
                <p className="font-bold text-2xl">বাজার দর</p>
                <p>{date}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="pointer btn px-4.25 py-1">সাইন ইন</button>
              <button className="pointer bg-[#40893F] btn px-4.25 py-1 text-[#FAFCFA]">
                সাইন আপ
              </button>
            </div>
          </div>
        </div>
        <div>
          {" "}
          <div className="flex gap-12 max-w-6xl mx-auto">
            {categories.map((category:ICategory) => (
              <li key={category?.id} className="list-none px-3.25 text-[#1D2720] font-semibold">
                <span>{category?.icon}</span>
                <span>{category?.nameBn}</span>
              </li>
            ))}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;

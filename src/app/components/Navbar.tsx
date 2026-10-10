"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface ICategory {
  id: string;
  nameBn: string;
  icon: string;
}

const Navbar = () => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    fetch("https://api.abcz.workers.dev/api/bazardor/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.log(err));
  }, []);

  const date = new Intl.DateTimeFormat("bn-BD", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Dhaka",
  }).format(new Date());

  return (
    <nav className="bg-[#FAFCFA] flex flex-col gap-4">
      {/* ================= HEADER ================= */}
      <div>
        <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-0">
          <div className="relative flex items-center justify-between min-h-17.5 md:min-h-0">
            {/* ================= MOBILE HAMBURGER ================= */}
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden flex flex-col gap-1.5 p-2"
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              <span className="block w-6 h-0.5 bg-[#1D2720]" />
              <span className="block w-6 h-0.5 bg-[#1D2720]" />
              <span className="block w-6 h-0.5 bg-[#1D2720]" />
            </button>

            {/* ================= LOGO + TITLE + DATE ================= */}
            <div
              className="
                flex items-center gap-2

                absolute left-1/2 -translate-x-1/2

                md:static
                md:left-auto
                md:translate-x-0
              "
            >
              <div>
                <Link href="/">
                  <Image
                    className="bg-[#40893F] rounded-xl p-3"
                    width={50}
                    height={40}
                    src="/logo-icon.png"
                    alt="logo-icon"
                  />
                </Link>
              </div>

              <div className="whitespace-nowrap">
                <Link href="/">
                  <p className="font-bold text-xl sm:text-2xl">বাজার দর</p>
                </Link>

                <p className="text-xs sm:text-sm">{date}</p>
              </div>
            </div>

            {/* ================= AUTH BUTTONS ================= */}
            <div className="flex gap-1 sm:gap-2 ml-auto md:ml-0">
              <button className="pointer btn px-2 sm:px-4.25 py-1 text-sm sm:text-base">
                সাইন ইন
              </button>

              <button className="pointer bg-[#40893F] btn px-2 sm:px-4.25 py-1 text-[#FAFCFA] text-sm sm:text-base">
                সাইন আপ
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ================= MOBILE MENU ================= */}
      {menuOpen && (
        <div className="md:hidden border-t border-slate-200">
          <div className="flex flex-col gap-2 py-3 px-4">
            {categories.map((category) => (
              <li
                key={category.id}
                className="list-none px-3.25 py-2 text-[#1D2720] font-semibold"
                onClick={() => setMenuOpen(false)}
              >
                <span>{category.icon}</span> <span>{category.nameBn}</span>
              </li>
            ))}
          </div>
        </div>
      )}

      {/* ================= TABLET + LAPTOP CATEGORY NAV ================= */}
      <div className="hidden md:block">
        <div
          className="
            max-w-6xl mx-auto

            flex
            flex-wrap
            justify-center
            items-center

            gap-x-5
            gap-y-2

            lg:gap-x-8
            xl:gap-x-12

            py-3
            mb-2.5

            px-4
            lg:px-0
          "
        >
          {categories.map((category) => (
            <li
              key={category.id}
              className="
                list-none
                px-2
                lg:px-3.25
                text-[#1D2720]
                font-semibold
                whitespace-nowrap
              "
            >
              <span>{category.icon}</span> <span>{category.nameBn}</span>
            </li>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

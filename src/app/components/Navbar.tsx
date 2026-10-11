"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface ICategory {
  id: string;
  nameBn: string;
  icon: string;
  slug: string;
}

const Navbar = () => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const controller = new AbortController();

    const fetchCategories = async () => {
      try {
        const res = await fetch(
          "https://openapi.programming-hero.com/api/bazardor/categories",
          { signal: controller.signal },
        );

        if (!res.ok) {
          throw new Error("Failed to fetch categories");
        }

        const result: unknown = await res.json();

        // Support either a direct array or an object containing data.
        let items: unknown = result;

        if (typeof result === "object" && result !== null && "data" in result) {
          items = result.data;
        }

        if (!Array.isArray(items)) {
          throw new Error("Invalid categories response");
        }

        setCategories(items as ICategory[]);
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }

        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();

    return () => controller.abort();
  }, []);

  const date = new Intl.DateTimeFormat("bn-BD", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Dhaka",
  }).format(new Date());

  // Check whether the current category is active.
  const isCategoryActive = (slug: string) => {
    return pathname === `/category/${slug}`;
  };

  // Shared styles for mobile and desktop category links.
  const getCategoryClass = (slug: string) => {
    const base =
      "flex items-center gap-2 rounded-lg px-3 py-2 font-semibold whitespace-nowrap transition-colors";

    return isCategoryActive(slug)
      ? `${base} bg-[#40893F] text-white`
      : `${base} text-[#1D2720] hover:bg-[#EAF3E9]`;
  };

  const handleCategoryClick = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="flex flex-col gap-4 bg-[#FAFCFA]">
      {/* HEADER */}
      <div>
        <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-0">
          <div className="relative flex min-h-17.5 items-center justify-between md:min-h-0">
            {/* MOBILE HAMBURGER */}
            <button
              type="button"
              onClick={() => setMenuOpen((previous) => !previous)}
              className="flex flex-col gap-1.5 p-2 md:hidden"
              aria-label="Toggle category menu"
              aria-expanded={menuOpen}
            >
              <span className="block h-0.5 w-6 bg-[#1D2720]" />
              <span className="block h-0.5 w-6 bg-[#1D2720]" />
              <span className="block h-0.5 w-6 bg-[#1D2720]" />
            </button>

            {/* LOGO + TITLE + DATE */}
            <div className="absolute left-1/2 flex -translate-x-1/2 items-center gap-2 md:static md:translate-x-0">
              <Link href="/" aria-label="বাজার দর হোম">
                <Image
                  className="rounded-xl bg-[#40893F] p-3"
                  width={50}
                  height={40}
                  src="/logo-icon.png"
                  alt="বাজার দর লোগো"
                />
              </Link>

              <div className="whitespace-nowrap">
                <Link href="/">
                  <p className="text-xl font-bold sm:text-2xl">বাজার দর</p>
                </Link>

                <p className="text-xs sm:text-sm">{date}</p>
              </div>
            </div>

            {/* AUTH BUTTONS */}
            <div className="ml-auto flex gap-1 sm:gap-2 md:ml-0">
              <Link
                href="/sign-in"
                className="btn px-2 py-1 text-sm sm:px-4.25 sm:text-base"
              >
                সাইন ইন
              </Link>

              <Link
                href="/sign-up"
                className="btn bg-[#40893F] px-2 py-1 text-sm text-[#FAFCFA] sm:px-4.25 sm:text-base"
              >
                সাইন আপ
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE CATEGORY MENU */}
      {menuOpen && (
        <div className="border-t border-slate-200 md:hidden">
          <div className="flex flex-col gap-2 px-4 py-3">
            {categories.map((category) => {
              const active = isCategoryActive(category.slug);

              return (
                <Link
                  key={category.id}
                  href={`/category/${category.slug}`}
                  onClick={handleCategoryClick}
                  className={getCategoryClass(category.slug)}
                  aria-current={active ? "page" : undefined}
                >
                  <span>{category.icon}</span>
                  <span>{category.nameBn}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* TABLET + DESKTOP CATEGORY NAV */}
      <div className="hidden md:block">
        <div className="mx-auto mb-2.5 flex max-w-6xl flex-wrap items-center justify-center gap-x-5 gap-y-2 px-4 py-3 lg:gap-x-8 lg:px-0 xl:gap-x-12">
          {categories.map((category) => {
            const active = isCategoryActive(category.slug);

            return (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className={getCategoryClass(category.slug)}
                aria-current={active ? "page" : undefined}
              >
                <span>{category.icon}</span>
                <span>{category.nameBn}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

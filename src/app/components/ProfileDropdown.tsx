
"use client";

import Image from "next/image";
import Link from "next/link";
import { useSession, signOut } from "@/lib/auth-client";

export default function ProfileDropdown() {
  const { data: session, isPending } = useSession();

  // Avoid showing the wrong UI while checking the session
  if (isPending) {
    return <div className="h-10 w-24 animate-pulse rounded-lg bg-gray-100" />;
  }

  // Logged out: show Sign In and Sign Up
  if (!session?.user) {
    return (
      <div className="ml-auto flex gap-1 sm:gap-2 md:ml-0">
        <Link
          href="/sign-in"
          className="rounded-lg border border-[#40893F] px-4 py-2 font-medium text-[#40893F] transition hover:bg-[#E1F1E7]"
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
    );
  }

  const user = session.user;

  // Logged in: show profile and dropdown
  return (
    <details className="group relative">
      <summary className="flex cursor-pointer list-none items-center gap-3 rounded-xl px-2 py-1.5 transition hover:bg-[#F0F5F0] [&::-webkit-details-marker]:hidden">
        {user.image ? (
          <Image
            src={user.image}
            alt={user.name || "Profile"}
            width={44}
            height={44}
            className="size-11 rounded-2xl object-cover"
          />
        ) : (
          <div className="flex size-11 items-center justify-center rounded-2xl bg-[#E1F1E7] text-lg font-bold text-[#40893F]">
            {user.name?.charAt(0).toUpperCase() || "U"}
          </div>
        )}

        <span className="max-w-32 truncate font-semibold text-[#26352B]">
          {user.name || "User"}
        </span>

        <span className="text-xs text-[#788078] transition group-open:rotate-180">
          ▼
        </span>
      </summary>

      <div className="absolute right-0 top-full z-50 mt-3 w-72 max-w-[calc(100vw-2rem)] rounded-2xl border border-[#DDE7DE] bg-white p-5 shadow-lg">
        {/* User information */}
        <div className="border-b border-[#E8EEE8] pb-4">
          <p className="truncate font-semibold text-[#26352B]">
            {user.name || "User"}
          </p>

          <p className="mt-1 break-all text-sm text-[#727B74]">
            {user.email}
          </p>
        </div>

        {/* Profile link */}
        <Link
          href="/my-profile"
          className="mt-3 flex items-center gap-2 rounded-lg px-2 py-2.5 text-[#26352B] transition hover:bg-[#F0F5F0]"
        >
          <span>👤</span>
          <span>আমার প্রোফাইল</span>
        </Link>

        {/* Sign out */}
        <button
          type="button"
          onClick={() => signOut()}
          className="mt-1 flex w-full items-center gap-2 rounded-lg px-2 py-2.5 text-left text-red-500 transition hover:bg-red-50"
        >
          <span>↪</span>
          <span>সাইন আউট</span>
        </button>
      </div>
    </details>
  );
}

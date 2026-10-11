import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F0F5F0] flex items-center justify-center px-4">
      <div className="text-center bg-white p-8 rounded-2xl border border-gray-200 shadow-sm max-w-md w-full">
        <h1 className="text-6xl font-bold text-green-700 mb-2">৪০৪</h1>
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          পৃষ্ঠাটি পাওয়া যায়নি
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          আপনি যে পেজটি খুঁজছেন তা মুছে ফেলা হয়েছে অথবা ভুল ঠিকানায় প্রবেশ
          করেছেন।
        </p>
        <Link
          href="/"
          className="btn bg-green-700 hover:bg-emerald-700 text-white border-none w-full rounded-xl"
        >
          হোম পেজে ফিরে যান
        </Link>
      </div>
    </div>
  );
}

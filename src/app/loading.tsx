export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F0F5F0] px-4 py-6 sm:px-6">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-center gap-5">
        {/* Loading indicator */}
        <div className="relative flex size-28 items-center justify-center sm:size-36">
          <div className="absolute size-full animate-spin rounded-full border-[6px] border-[#DDE8DE] border-t-[#40893F]" />

          <span className="text-4xl font-bold text-[#40893F] sm:text-5xl">
            ৳
          </span>
        </div>

        <p className="text-lg font-bold text-[#40893F] sm:text-xl">
          পণ্যের তথ্য লোড হচ্ছে...
        </p>

        <p className="text-sm text-[#858D87] sm:text-base">
          অনুগ্রহ করে একটু অপেক্ষা করুন
        </p>
      </div>
    </main>
  );
}

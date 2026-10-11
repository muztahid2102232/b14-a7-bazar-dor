import React from "react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#F0F5F0] flex flex-col items-center justify-center gap-3">
      <span className="loading loading-spinner loading-lg text-green-700"></span>
      <p className="text-gray-600 text-sm font-medium">
        পণ্যের তথ্য লোড হচ্ছে...
      </p>
    </div>
  );
}

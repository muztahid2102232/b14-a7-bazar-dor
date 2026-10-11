"use client";

import { Input, Label, TextField } from "@heroui/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { signOut, updateUser, useSession } from "@/lib/auth-client";

const ProfilePage = () => {
  const { data: session, isPending } = useSession();

  const [name, setName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const user = session?.user;

  // Load the logged-in user's current name into the input
  useEffect(() => {
    if (user) {
      setName(user.name ?? "");
    }
  }, [user?.name]);

  // Update the user's name
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name.trim()) {
      setError("নাম লিখুন");
      setMessage("");
      return;
    }

    if (!user) {
      setError("আপডেট করার জন্য লগইন করুন");
      return;
    }

    setIsSaving(true);
    setMessage("");
    setError("");

    try {
      const result = await updateUser({
        name: name.trim(),
      });

      if (result.error) {
        setError(result.error.message || "তথ্য আপডেট করা যায়নি");
        return;
      }

      setMessage("আপনার নাম সফলভাবে আপডেট হয়েছে!");
    } catch {
      setError("একটি সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setIsSaving(false);
    }
  };

  // Sign out the current user
  const handleSignOut = async () => {
    try {
      await signOut();
    } catch {
      setError("সাইন আউট করা যায়নি। আবার চেষ্টা করুন।");
    }
  };

  // Show a loading state while Better Auth checks the session
  if (isPending) {
    return (
      <div className="flex min-h-60 items-center justify-center bg-[#F0F5F0]">
        <p className="font-medium text-[#40893F]">প্রোফাইল লোড হচ্ছে...</p>
      </div>
    );
  }

  // Prevent unauthenticated users from viewing the profile
  if (!user) {
    return (
      <div className="flex min-h-60 flex-col items-center justify-center gap-4 bg-[#F0F5F0] p-6">
        <p className="font-medium text-[#26352B]">
          আপনার প্রোফাইল দেখতে প্রথমে লগইন করুন।
        </p>

        <a
          href="/sign-in"
          className="rounded-lg bg-[#40893F] px-5 py-2.5 font-medium text-white"
        >
          সাইন ইন
        </a>
      </div>
    );
  }

  return (
    <div className="bg-[#F0F5F0]">
      <div className="mx-auto flex max-w-6xl flex-col gap-5 p-8">
        {/* Page heading */}
        <div>
          <h3 className="text-[25px] font-bold">আমার প্রোফাইল</h3>

          <p className="font-medium text-[#949A96]">
            আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন
          </p>
        </div>

        {/* Logged-in user's information */}
        <div className="flex flex-col items-start justify-between gap-5 rounded-2xl bg-[#FAFCFA] p-6 sm:flex-row sm:items-center">
          <div className="flex min-w-0 items-center gap-3">
            {user.image ? (
              <img
                src={user.image}
                alt={user.name || "Profile"}
                className="size-16 shrink-0 rounded-2xl object-cover"
              />
            ) : (
              <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-[#E1F1E7] text-2xl font-bold text-[#40893F]">
                {user.name?.charAt(0).toUpperCase() || "U"}
              </div>
            )}

            <div className="min-w-0">
              <p className="break-words text-lg font-semibold sm:text-[25px]">
                {user.name || "নাম দেওয়া হয়নি"}
              </p>

              <p className="break-all text-[#69736C]">{user.email}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSignOut}
            className="flex shrink-0 items-center gap-2 rounded-sm border-2 border-red-500 px-2.5 py-3 text-red-500 transition hover:bg-red-50"
          >
            <Image src="/arrow.png" alt="" height={20} width={20} />
            সাইন আউট
          </button>
        </div>

        {/* Edit profile form */}
        <div className="rounded-2xl bg-[#FAFCFA] p-6">
          <h4 className="ml-0 font-semibold sm:ml-10">তথ্য</h4>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-3 px-0 py-8 sm:px-10"
          >
            <TextField
              className="flex w-full flex-col gap-2"
              isRequired
              name="name"
            >
              <Label className="label">নাম</Label>

              <Input
                name="name"
                type="text"
                className="input w-full"
                placeholder="যেমন: রহিম উদ্দিন"
                value={name}
                onChange={(event) => setName(event.target.value)}
                isRequired
              />
            </TextField>

            {/* Success message */}
            {message && (
              <p role="status" className="text-sm font-medium text-green-700">
                {message}
              </p>
            )}

            {/* Error message */}
            {error && (
              <p role="alert" className="text-sm font-medium text-red-500">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isSaving}
              className="btn mt-4 w-full bg-[#40893F] text-slate-100 transition hover:bg-[#327432] disabled:cursor-not-allowed disabled:opacity-60 sm:w-64"
            >
              {isSaving ? "আপডেট হচ্ছে..." : "আপডেট"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

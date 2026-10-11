"use client";

import { useState } from "react";
import { TextField, FieldError, Label, Input } from "@heroui/react";
import Image from "next/image";
import { signIn } from "@/lib/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

type SignInFormData = {
  email: string;
  password: string;
};

const SignInPage = () => {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isGithubLoading, setIsGithubLoading] = useState(false);

  const router = useRouter();

  // Email and password sign in
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isLoading) return;

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const passwordValue = formData.get("password");

    if (
      typeof email !== "string" ||
      typeof passwordValue !== "string" ||
      !email.trim() ||
      !passwordValue
    ) {
      toast.error("ইমেইল ও পাসওয়ার্ড দিন");
      return;
    }

    const signInData: SignInFormData = {
      email: email.trim(),
      password: passwordValue,
    };

    setIsLoading(true);

    try {
      const { data, error } = await signIn.email(signInData);

      if (error) {
        toast.error(error.message || "সাইন ইন করা যায়নি");
        return;
      }

      if (!data) {
        toast.error("সাইন ইন সম্পন্ন হয়েছে কিনা যাচাই করা যায়নি");
        return;
      }

      toast.success("সফলভাবে সাইন ইন হয়েছে!");

      router.replace("/");
      router.refresh();
    } catch (error: unknown) {
      console.error("Sign-in error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "একটি অপ্রত্যাশিত সমস্যা হয়েছে। আবার চেষ্টা করুন।",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Google sign in
  const handleGoogleSignIn = async () => {
    if (isGoogleLoading) return;

    setIsGoogleLoading(true);

    try {
      const { error } = await signIn.social({
        provider: "google",
        callbackURL: "/",
      });

      if (error) {
        toast.error(error.message || "Google দিয়ে সাইন ইন করা যায়নি");
        setIsGoogleLoading(false);
      }
    } catch (error: unknown) {
      console.error("Google sign-in error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Google দিয়ে সাইন ইন করার সময় সমস্যা হয়েছে",
      );

      setIsGoogleLoading(false);
    }
  };

  // GitHub sign in
  const handleGithubSignIn = async () => {
    if (isGithubLoading) return;

    setIsGithubLoading(true);

    try {
      const { error } = await signIn.social({
        provider: "github",
        callbackURL: "/",
      });

      if (error) {
        toast.error(error.message || "GitHub দিয়ে সাইন ইন করা যায়নি");
        setIsGithubLoading(false);
      }
    } catch (error: unknown) {
      console.error("GitHub sign-in error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "GitHub দিয়ে সাইন ইন করার সময় সমস্যা হয়েছে",
      );

      setIsGithubLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center bg-[#F0F5F0] p-6 sm:p-10">
      <div className="mb-7 text-center">
        <h1 className="text-[24px] font-semibold">সাইন ইন</h1>

        <p className="font-medium text-[#949A96]">
          বিস্তারিত দাম, বাজার তুলনা ও প্রোফাইল দেখতে অ্যাকাউন্টে ঢুকুন
        </p>
      </div>

      {/* Sign-in form */}
      <div className="w-full max-w-md rounded-2xl bg-[#FAFCFA]">
        <form
          className="flex flex-col gap-1 px-5 py-8 sm:px-10"
          onSubmit={onSubmit}
        >
          <TextField
            className="flex w-full flex-col gap-2"
            isRequired
            name="email"
            type="email"
            validate={(value) => {
              if (
                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)
              ) {
                return "একটি ভ্যালিড ইমেইল দিন";
              }

              return null;
            }}
          >
            <Label className="label">ইমেইল</Label>

            <Input
              name="email"
              type="email"
              className="input w-full"
              placeholder="you@example.com"
            />

            <FieldError />
          </TextField>

          <TextField
            className="mt-3 flex w-full flex-col gap-2"
            name="password"
            type="password"
            isRequired
            value={password}
            onChange={setPassword}
            validate={(value) => {
              if (value.length < 8) {
                return "পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে";
              }

              return null;
            }}
          >
            <Label>পাসওয়ার্ড</Label>

            <Input
              name="password"
              type="password"
              className="input w-full"
              placeholder="কমপক্ষে ৮ অক্ষর"
            />

            <FieldError />
          </TextField>

          <button
            type="submit"
            disabled={isLoading}
            className="btn mt-4 w-full bg-[#40893F] text-slate-100 transition hover:bg-[#327432] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "সাইন ইন হচ্ছে..." : "সাইন ইন"}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-6 py-4">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="shrink-0 text-gray-500">অথবা</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          {/* Google and GitHub sign in */}
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading || isGithubLoading}
              className="flex items-center justify-center gap-2.5 rounded-2xl border border-slate-400 p-2.5 transition hover:bg-gray-100 disabled:opacity-60"
            >
              <Image
                src="/google.png"
                alt=""
                height={20}
                width={20}
              />

              <span className="font-semibold text-black">
                {isGoogleLoading
                  ? "অপেক্ষা করুন..."
                  : "Google দিয়ে চালিয়ে যান"}
              </span>
            </button>

            <button
              type="button"
              onClick={handleGithubSignIn}
              disabled={isGithubLoading || isGoogleLoading}
              className="flex items-center justify-center gap-2.5 rounded-2xl border border-slate-400 p-2.5 transition hover:bg-gray-100 disabled:opacity-60"
            >
              <Image
                src="/github.png"
                alt=""
                height={20}
                width={20}
              />

              <span className="font-semibold text-black">
                {isGithubLoading
                  ? "অপেক্ষা করুন..."
                  : "GitHub দিয়ে চালিয়ে যান"}
              </span>
            </button>
          </div>

          <p className="mt-4 text-center font-medium">
            অ্যাকাউন্ট নেই?{" "}
            <Link
              href="/sign-up"
              className="text-green-600 hover:underline"
            >
              সাইন আপ করুন
            </Link>
          </p>
        </form>
      </div>

      <p className="mt-8">
        <Link href="/" className="hover:text-green-700">
          ← হোম পেজে ফিরে যান
        </Link>
      </p>
    </div>
  );
};

export default SignInPage;


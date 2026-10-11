"use client";

import { useState } from "react";
import { TextField, FieldError, Label, Input } from "@heroui/react";
import Image from "next/image";
import { signIn, signUp } from "@/lib/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

type SignupFormData = {
  name: string;
  email: string;
  password: string;
};

const SignUpPage = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isGithubLoading, setIsGithubLoading] = useState(false);

  const router = useRouter();

  // Email and password sign up
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isLoading) return;

    const formData = new FormData(e.currentTarget);

    const name = formData.get("name");
    const email = formData.get("email");
    const passwordValue = formData.get("password");
    const confirmPasswordValue = formData.get("confirmPassword");

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof passwordValue !== "string" ||
      typeof confirmPasswordValue !== "string"
    ) {
      toast.error("সঠিক তথ্য দিয়ে ফর্মটি পূরণ করুন");
      return;
    }

    if (!name.trim() || !email.trim() || !passwordValue) {
      toast.error("সবগুলো প্রয়োজনীয় তথ্য পূরণ করুন");
      return;
    }

    if (passwordValue.length < 8) {
      toast.error("পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে");
      return;
    }

    if (passwordValue !== confirmPasswordValue) {
      toast.error("পাসওয়ার্ড মেলেনি। আবার চেষ্টা করুন");
      return;
    }

    const signupData: SignupFormData = {
      name: name.trim(),
      email: email.trim(),
      password: passwordValue,
    };

    setIsLoading(true);

    try {
      const { data, error } = await signUp.email(signupData);

      if (error) {
        toast.error(error.message || "অ্যাকাউন্ট তৈরি করা যায়নি");
        return;
      }

      if (!data) {
        toast.error("অ্যাকাউন্ট তৈরি হয়েছে কিনা যাচাই করা যায়নি");
        return;
      }

      toast.success("আপনার অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!");

      router.replace("/");
      router.refresh();
    } catch (error: unknown) {
      console.error("Sign-up error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "একটি অপ্রত্যাশিত সমস্যা হয়েছে। আবার চেষ্টা করুন",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Google sign up
  const handleGoogleSignIn = async () => {
    if (isGoogleLoading || isGithubLoading) return;

    setIsGoogleLoading(true);

    try {
      const { error } = await signIn.social({
        provider: "google",
        callbackURL: "/",
      });

      if (error) {
        toast.error(error.message || "Google দিয়ে সাইন আপ করা যায়নি");
        setIsGoogleLoading(false);
      }
    } catch (error: unknown) {
      console.error("Google sign-up error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Google দিয়ে সাইন আপ করার সময় সমস্যা হয়েছে",
      );

      setIsGoogleLoading(false);
    }
  };

  // GitHub sign up
  const handleGithubSignIn = async () => {
    if (isGithubLoading || isGoogleLoading) return;

    setIsGithubLoading(true);

    try {
      const { error } = await signIn.social({
        provider: "github",
        callbackURL: "/",
      });

      if (error) {
        toast.error(error.message || "GitHub দিয়ে সাইন আপ করা যায়নি");
        setIsGithubLoading(false);
      }
    } catch (error: unknown) {
      console.error("GitHub sign-up error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "GitHub দিয়ে সাইন আপ করার সময় সমস্যা হয়েছে",
      );

      setIsGithubLoading(false);
    }
  };

  return (
    <>
      <div className="bg-[#F0F5F0] flex flex-col items-center p-10">
        <div className="text-center mb-7">
          <h1 className="text-[24px] font-semibold">
            অ্যাকাউন্ট তৈরি করুন
          </h1>

          <p className="font-medium text-[#949A96]">
            বিনা খরচে সাইন আপ করে সব বিস্তারিত দাম দেখুন
          </p>
        </div>

        {/* Form section */}
        <div className="bg-[#FAFCFA] rounded-2xl">
          <form
            action="/sign-in"
            className="flex flex-col gap-1 py-8 px-10"
            onSubmit={onSubmit}
          >
            <TextField
              className="flex flex-col gap-2 w-97"
              isRequired
              name="name"
            >
              <Label className="label">নাম</Label>

              <Input
                name="name"
                type="text"
                className="input w-full"
                placeholder="যেমন: রহিম উদ্দিন"
              />
            </TextField>

            <TextField
              className="flex flex-col gap-2 w-97"
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
              validate={(value) => {
                if (value.length < 8) {
                  return "পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে";
                }

                return null;
              }}
              minLength={8}
              className="flex flex-col gap-2 w-97"
              name="password"
              type="password"
              isRequired
              value={password}
              onChange={setPassword}
            >
              <Label>পাসওয়ার্ড</Label>

              <Input
                name="password"
                type="password"
                placeholder="কমপক্ষে ৮ অক্ষর"
                className="w-full"
              />

              <FieldError />
            </TextField>

            <TextField
              className="flex flex-col gap-2 w-97"
              name="confirmPassword"
              type="password"
              isRequired
              value={confirmPassword}
              onChange={setConfirmPassword}
              validate={(value) => {
                if (value !== password) {
                  return "পাসওয়ার্ড মেলেনি";
                }

                return null;
              }}
            >
              <Label>পাসওয়ার্ড নিশ্চিত করুন</Label>

              <Input
                name="confirmPassword"
                type="password"
                placeholder="আবার লিখুন"
                className="w-full"
              />

              <FieldError />
            </TextField>

            <button
              type="submit"
              disabled={isLoading}
              className="btn mt-4 w-97 text-slate-100 bg-[#40893F] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? "অ্যাকাউন্ট তৈরি হচ্ছে..." : "অ্যাকাউন্ট তৈরি করুন"}
            </button>

            {/* Or section */}
            <div className="flex items-center gap-6 py-4">
              <div className="h-0.75 flex-1 bg-gray-200" />

              <span className="shrink-0 text-gray-500">অথবা</span>

              <div className="h-0.75 flex-1 bg-gray-200" />
            </div>

            {/* Google and GitHub sign-up section */}
            <div className="flex gap-2.5 justify-center">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isGoogleLoading || isGithubLoading}
                className="flex gap-2.5 border border-slate-400 p-2.5 rounded-2xl disabled:opacity-60"
              >
                <Image
                  src="/google.png"
                  alt="Google"
                  height={20}
                  width={20}
                />

                <span className="text-black font-semibold">
                  {isGoogleLoading
                    ? "অপেক্ষা করুন..."
                    : "Google দিয়ে চালিয়ে যান"}
                </span>
              </button>

              <button
                type="button"
                onClick={handleGithubSignIn}
                disabled={isGithubLoading || isGoogleLoading}
                className="flex gap-2.5 border border-slate-400 p-2.5 rounded-2xl disabled:opacity-60"
              >
                <Image
                  src="/github.png"
                  alt="GitHub"
                  height={20}
                  width={20}
                />

                <span className="text-black font-semibold">
                  {isGithubLoading
                    ? "অপেক্ষা করুন..."
                    : "GitHub দিয়ে চালিয়ে যান"}
                </span>
              </button>
            </div>

            <p className="font-medium text-center mt-2">
              অ্যাকাউন্ট আছে?{" "}
              <Link
                href="/sign-in"
                className="text-green-600 hover:underline"
              >
                সাইন ইন করুন
              </Link>
            </p>
          </form>
        </div>

        <p className="mt-8">
          <Link href="/">← হোম পেজে ফিরে যান</Link>
        </p>
      </div>
    </>
  );
};

export default SignUpPage;


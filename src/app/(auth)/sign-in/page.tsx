"use client";
import { useState } from "react";
import { TextField, FieldError, Label, Input } from "@heroui/react";
import Form from "next/form";
import Image from "next/image";
import { signIn } from "@/lib/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";

type SignupFormData = {
  email: string;
  password: string;
};


const SignInPage = () => {
  const [password, setPassword] = useState("");
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    if (
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      console.error("Invalid form data");
      return;
    }

    const signupData: SignupFormData = {
      email,
      password,
    };

    try {
      const { data: userData, error } = await signIn.email(signupData);

      if (error) {
        console.error(error.message);
        return;
      }

      console.log("Signin successful:", userData);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error("An unexpected error occurred");
      }
    }
    router.replace("/")
  };
  const handleGoogleSignIn = async () => {
    const data = await signIn.social({
      provider: "google",
    });
    console.log(data);
  };
  const handleGithubSignIn = async () => {
    const data = await signIn.social({
      provider: "github",
    });
    console.log(data);
  };
  return (
    <>
      <div className="bg-[#F0F5F0] flex flex-col items-center p-10">
        <div className="text-center mb-7">
          <h1 className="text-[24px] font-semibold">সাইন ইন</h1>
          <p className="font-medium text-[#949A96]">
            বিস্তারিত দাম, বাজার তুলনা ও প্রোফাইল দেখতে অ্যাকাউন্টে ঢুকুন
          </p>
        </div>

        {/* form section  */}

        <div className="bg-[#FAFCFA] rounded-2xl">
          <Form
            action="/"
            className="flex flex-col gap-1 py-8 px-10"
            onSubmit={onSubmit}
          >
            <TextField
              className="flex flex-col gap-2 w-96"
              isRequired
              name="email"
              type="email"
              validate={(value) => {
                if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
                  return "একটি ভ্যালিড ইমেইল দিন";
                }
                return null;
              }}
            >
              <Label className="label">ইমেইল</Label>
              <Input
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
              className="flex flex-col gap-2 w-96"
              name="password"
              type="password"
              isRequired
              value={password}
              onChange={setPassword}
            >
              <Label>পাসওয়ার্ড</Label>
              <Input placeholder="কমপক্ষে ৮ অক্ষর" className="w-full" />
              <FieldError />
            </TextField>

            <button className="btn mt-4 w-96 text-slate-100 bg-[#40893F]">
              সাইন ইন
            </button>

            {/* অথবা section  */}

            <div className="flex items-center gap-6 py-4">
              <div className="h-0.75 flex-1 bg-gray-200" />

              <span className="shrink-0  text-gray-500">অথবা</span>

              <div className="h-0.75 flex-1 bg-gray-200" />
            </div>

            {/* google and github sign up section  */}
            <div className="flex gap-2.5 justify-center pointer">
              <button
                onClick={handleGoogleSignIn}
                className="flex gap-2.5 border border-slate-400 p-2.5 rounded-2xl"
              >
                <Image src="/google.png" alt="google" height={20} width={20} />
                <span className="text-black font-semibold">
                  Google দিয়ে চালিয়ে যান
                </span>
              </button>
              <button
                onClick={handleGithubSignIn}
                className="flex gap-2.5 border border-slate-400 p-2.5 rounded-2xl"
              >
                {" "}
                <Image src="/github.png" alt="google" height={20} width={20} />
                <span className="text-black font-semibold">
                  Github দিয়ে চালিয়ে যান
                </span>
              </button>
            </div>

            <p className="font-medium text-center mt-2">
              অ্যাকাউন্ট নেই ?{" "}
              <Link href="/sign-up" className="text-green-600 hover:underline">
                সাইন আপ করুন
              </Link>
            </p>
          </Form>
        </div>
         <p className="mt-8">
                 <Link href="/"> ← হোম পেজে ফিরে যান</Link>
                </p>
      </div>
    </>
  );
};

export default SignInPage;

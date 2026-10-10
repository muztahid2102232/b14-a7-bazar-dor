import { Input, Label, TextField } from "@heroui/react";
import Form from "next/form";
import Image from "next/image";

const ProfilePage = () => {
  return (
    <>
      <div className="bg-[#F0F5F0]">
        <div className=" max-w-6xl mx-auto p-8">
          <div>
            <h3 className="text-[25px] font-bold">আমার প্রোফাইল</h3>
            <p className="font-medium text-[#949A96]">
              আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন
            </p>
          </div>
          <div>
            <div className="bg-[#FAFCFA] flex justify-between">
              <div className="flex">
                <Image src="/avatar.png" alt="avatar" height={40} width={40} />
                <div>
                  {" "}
                  <p>Md. Muztahid Hossain</p>
                  <p>rezwanahmed@gmail.com</p>
                </div>
              </div>
              <div>
                {" "}
                <button className="flex text-red-500">
                  <Image src="/arrow.png" alt="arrow" height={20} width={20} />
                  সাইন আউট
                </button>
              </div>
            </div>
          </div>

          <div>
            <h4>তথ্য</h4>
            <Form action="/" className="flex flex-col gap-1 py-8 px-10">
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
              <button className="btn mt-4 w-97 text-slate-100 bg-[#40893F]">
                আপডেট
              </button>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;

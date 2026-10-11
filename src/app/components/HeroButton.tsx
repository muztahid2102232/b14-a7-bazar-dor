import Link from "next/link";

const HeroButton = () => {
  return (
    <Link
      href="#সব-পণ্য"
      className="btn self-start bg-[#40893F] text-[#FAFCFA] transition hover:bg-[#327432]"
    >
      সব পণ্য দেখুন
    </Link>
  );
};

export default HeroButton;

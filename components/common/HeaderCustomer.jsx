"use client";
import Icon from "@/components/common/Icons";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Header = () => {
  const router = useRouter();
  return (
    <div className="pt-10 pb-4 h-[99px] rounded-b-3xl  bg-greens-900 px-4">
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="border-0 outline-0 bg-transparent"
        >
          <Icon icon="back" className="invert" />
        </button>
        <Image
          src="/assets/images/svg/logo.svg"
          width={86}
          height={41}
          sizes="100vw"
          className="w-[86px] h-[41px] object-cover"
          alt="logo"
        />
      </div>
    </div>
  );
};

export default Header;

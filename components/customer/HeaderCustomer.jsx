"use client";
import Icon from "@/components/common/Icons";
import { useRouter } from "next/navigation";

const HeaderCustomer = ({name}) => {
  const router = useRouter();
  return (
    <div className="pt-[50px] pb-4 h-[176px] rounded-b-3xl  bg-greens-900 px-4">
      <button
        onClick={() => router.back()}
        className="border-0 outline-0 bg-transparent"
      >
        <Icon icon="back" className="invert" />
      </button>
      <h2 className="text-2xl capitalize font-semibold mt-10 font-roboto text-white !leading-130">
        {name}
      </h2>
    </div>
  );
};

export default HeaderCustomer;

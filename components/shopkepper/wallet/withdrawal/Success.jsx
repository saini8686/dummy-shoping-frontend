import { CustomButton } from "@/components/common/CustomButton";
import Image from "next/image";
import React from "react";

const Success = () => {
  return (
    <div className="h-[390px] px-4 bg-white rounded-t-[30px] w-full">
      <Image
        src="/assets/images/svg/confirm.svg"
        width={87}
        height={87}
        alt="confirm"
        className="flex mx-auto mb-4 mt-10"
      />
      <p className="font-medium text-blacks-200 text-base text-center !leading-130">
        Money Sent
      </p>
      <p className="font-medium text-[#666666] mx-auto text-center text-sm max-w-[239px] !leading-130">
        Your funds is on its way to you
      </p>
      <CustomButton url="/shopkepper/wallet" customClass="w-full text-center mt-10">
        Check Balance
      </CustomButton>
    </div>
  );
};

export default Success;

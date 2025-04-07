import { CustomButton } from "@/components/common/CustomButton";
import Image from "next/image";
import React from "react";

const QrCode = () => {
  return (
    <div>
      <div className="py-5 px-7 mt-[18px] rounded-lg bg-greys-100 w-full">
        <Image
          src="/assets/images/png/shopkepper/basic-detail-profile.png"
          alt="profile"
          width={63}
          height={63}
          className="size-[63px] object-cover rounded-full mx-auto flex"
        />
        <Image
          src="/assets/images/png/shopkepper/qr-code.png"
          alt="profile"
          width={263}
          height={263}
          className="h-[263px] w-[263px] object-cover mt-3 mx-auto flex"
        />
        <p className="text-sm mt-3 font-medium text-center leading-[150%] text-blacks-200">
          <span className="text-greens-900">Shop Name:</span> Lorem ipsum dolor
        </p>
        <p className="text-sm font-medium mt-2 text-center leading-[150%] text-blacks-200">
          <span className="text-greens-900">Village/City:</span> Lorem ipsum
          dolor
        </p>
      </div>
      <CustomButton customClass="w-full py-[11px] mt-8">
        Download QR Code
      </CustomButton>
      <button className="transparent-green-border-button w-full !text-greens-900 !py-[11px] hover:!text-white !mt-4">
        Regenerate QR Code
      </button>
    </div>
  );
};

export default QrCode;

import { CustomButton } from "@/components/common/CustomButton";
import Image from "next/image";
import React from "react";

const ProductAddedModal = ({ closeConfirm, showProductDetail }) => {
  return (
    <div className="max-w-[540px] w-full flex items-end mx-auto fixed left-1/2 bottom-0 z-[30] min-h-screen bg-black/30 -translate-x-1/2">
      <div className="h-[390px] px-4 bg-white rounded-t-[30px] w-full">
        <Image
          src="/assets/images/svg/confirm.svg"
          width={87}
          height={87}
          alt="confirm"
          className="flex mx-auto mb-4 mt-10"
        />
        <p className="font-medium text-blacks-200 text-base text-center !leading-130">
          Product added
        </p>
        <p className="font-medium text-[#666666] mx-auto text-center text-sm max-w-[239px] !leading-130">
          Your Product has been added to the list and is visible to customers
        </p>
        <CustomButton
          onClick={() => showProductDetail()}
          customClass="w-full mt-10"
        >
          View
        </CustomButton>
        <button
          onClick={() => closeConfirm()}
          className="transparent-green-border-button w-full !text-greens-900 !py-2.5 !font-medium hover:!text-white !mt-4"
        >
          Add more Product
        </button>
      </div>
    </div>
  );
};

export default ProductAddedModal;

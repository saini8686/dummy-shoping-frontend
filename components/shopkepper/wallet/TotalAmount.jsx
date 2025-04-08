import { CustomButton } from "@/components/common/CustomButton";
import Icon from "@/components/common/Icons";
import React from "react";

const TotalAmount = () => {
  return (
    <div className="px-6 w-full bg-greens-900/10 rounded-lg py-4">
      <div className="flex justify-between items-center">
        <h2 className="text-blacks-200 text-sm !leading-130">
          YOUR WALLET BALANCE
        </h2>
        <button>
            <Icon icon="greenEye" />
        </button>
      </div>
      <p className="text-greens-900 text-2xl !leading-130 mt-3">55,000.00</p>
      <CustomButton customClass="mt-4">Withdraw</CustomButton>
    </div>
  );
};

export default TotalAmount;
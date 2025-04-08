"use client"
import { CustomButton } from "@/components/common/CustomButton";
import Icon from "@/components/common/Icons";
import React, { useState } from "react";

const TotalAmount = () => {
  const [showBalance, setShowBalance] = useState(true); 
  return (
    <div className="px-6 w-full bg-greens-900/10 rounded-lg py-4">
      <div className="flex justify-between items-center">
        <h2 className="text-blacks-200 text-sm !leading-130">
          YOUR WALLET BALANCE
        </h2>
        <button onClick={() => setShowBalance((prev) => !prev)}>
          <Icon icon="greenEye" />
        </button>
      </div>
      <p className="text-greens-900 text-2xl !leading-130 mt-3">
        {showBalance ? "55,000.00" : "*******"}
      </p>
      <CustomButton url="/shopkepper/wallet/withdrawal" customClass="mt-4 w-fit">Withdraw</CustomButton>
    </div>
  );
};

export default TotalAmount;

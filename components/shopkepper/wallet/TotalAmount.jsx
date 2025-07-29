"use client"
import { CustomButton } from "@/components/common/CustomButton";
import Icon from "@/components/common/Icons";
import { useState } from "react";

const TotalAmount = (params) => {
  const userDetails = params.total;
  const [showBalance, setShowBalance] = useState(false);
  const [showBalance1, setShowBalance1] = useState(false);
  const [showBalance2, setShowBalance2] = useState(false);

  return (
    <>
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
          {showBalance ? userDetails?.wallet || 0.0 : "*******"}
        </p>
        {/* <CustomButton url="/shopkepper/wallet/withdrawal" customClass="mt-4 w-fit">Withdraw</CustomButton> */}
      </div>
      {userDetails?.isAdmin &&
        <div className="flex justify-between items-center">
          <div className="px-6 w-full bg-greens-900/10 rounded-lg py-4 mr-2">
            <div className="flex justify-between items-center">
              <h2 className="text-blacks-200 text-sm !leading-130">
                COMPANY 1
              </h2>
              <button onClick={() => setShowBalance1((prev) => !prev)}>
                <Icon icon="greenEye" />
              </button>
            </div>
            <p className="text-greens-900 text-2xl !leading-130 mt-3">
              {showBalance1 ? userDetails?.wallet1 || 0.0 : "*******"}
            </p>
          </div>
          <div className="px-6 w-full bg-greens-900/10 rounded-lg py-4 ms-2">
            <div className="flex justify-between items-center">
              <h2 className="text-blacks-200 text-sm !leading-130">
                COMPANY 2
              </h2>
              <button onClick={() => setShowBalance2((prev) => !prev)}>
                <Icon icon="greenEye" />
              </button>
            </div>
            <p className="text-greens-900 text-2xl !leading-130 mt-3">
              {showBalance2 ? userDetails?.wallet2 || 0.0 : "*******"}
            </p>
          </div>
        </div>
      }
    </>
  );
};

export default TotalAmount;

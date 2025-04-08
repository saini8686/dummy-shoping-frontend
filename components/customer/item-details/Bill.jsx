import { CustomButton } from "@/components/common/CustomButton";
import React from "react";

const Bill = ({ totalPrice }) => {
  return (
    <div className="mt-10">
      <div className="flex justify-between items-center">
        <p className="text-sm font-normal text-blacks-200">Subtotal</p>
        <p className="text-sm font-normal text-blacks-200">
          ₹{totalPrice.toFixed(2)}
        </p>
      </div>
      <div className="flex justify-between mt-4 items-center">
        <p className="text-sm font-normal text-blacks-200">Total</p>
        <p className="text-sm font-normal text-blacks-200">
          ₹{totalPrice.toFixed(2)}
        </p>
      </div>
      <CustomButton customClass="w-full py-3.5 mt-8">
        Self Delivery
      </CustomButton>
    </div>
  );
};

export default Bill;

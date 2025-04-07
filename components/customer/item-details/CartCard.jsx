"use client";
import { CustomButton } from "@/components/common/CustomButton";
import Icon from "@/components/common/Icons";
import Image from "next/image";
import { useState } from "react";
import Bill from "./Bill";

const CartCard = () => {
  const [quantity, setQuantity] = useState(1);
  const decreaseQuantity = () => {
    setQuantity(quantity - 1);
  };
  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };
  return (
    <>
      <div className="mt-4">
        <button type="button" className="border-0 outline-0 flex ml-auto mb-1">
          <Icon icon="removeCart" />
        </button>
        <div className="flex items-center gag-4">
          <Image
            src="/assets/images/png/cart/nido.png"
            alt="cart-product"
            sizes="100vw"
            className="w-[115px] h-[121px] object-cover"
            width={115}
            height={121}
          />
          <div>
            <h2 className="!leading-130 text-base font-medium text-blacks-200">
              Arla DANO Full Cream Milk Powder Instant
            </h2>
            <div className="flex mt-2 justify-between items-end">
              <div>
                <span className="!leading-130 text-sm block font-semibold line-through text-blues-300/50">
                  $200
                </span>
                <p className="!leading-130 text-xl mt-0.5 font-semibold text-reds-900">
                  $182
                </p>
              </div>
              <div className="flex items-center gap-4">
                <button
                  disabled={quantity === 1}
                  onClick={() => decreaseQuantity()}
                  className={`w-11 flex items-center justify-center h-11 rounded border border-white-100 ${
                    quantity === 1
                      ? "text-[#B3B3B3] pointer-events-none"
                      : "text-greens-900"
                  }`}
                >
                  <Icon icon="minusCart" />
                </button>
                <p className="font-semibold text-blacks-200">{quantity}</p>
                <button
                  onClick={() => increaseQuantity()}
                  className="w-11 flex items-center text-greens-900 justify-center h-11 rounded border border-white-100"
                >
                  <Icon icon="plusCart" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <CustomButton customClass=" py-3.5 !border-transparent !text-greens-900 !bg-greens-900/10 hover:!bg-greens-900 hover:!text-white mt-8 w-full">
        Add More Product
      </CustomButton>
      <Bill />
    </>
  );
};

export default CartCard;

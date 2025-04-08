"use client";
import { CustomButton } from "@/components/common/CustomButton";
import Icon from "@/components/common/Icons";
import Image from "next/image";
import { useState } from "react";
import Bill from "./Bill";
import { CART_ITEMS } from "@/utils/helper";

const CartCard = () => {
  const [cartItems, setCartItems] = useState(CART_ITEMS);

  const increaseQuantity = (index) => {
    const newCart = [...cartItems];
    newCart[index].quantity += 1;
    setCartItems(newCart);
  };

  const decreaseQuantity = (index) => {
    const newCart = [...cartItems];
    if (newCart[index].quantity > 1) {
      newCart[index].quantity -= 1;
      setCartItems(newCart);
    }
  };
  const removeItem = (indexToRemove) => {
    setCartItems((prevItems) =>
      prevItems.filter((_, index) => index !== indexToRemove)
    );
  };
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  return (
    <>
      <div className="mt-4">
        {cartItems.length !== 0 ? (
          cartItems.map((item, index) => (
            <div key={index} className="flex relative mt-5 items-center gap-4">
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="border-0 outline-0 absolute right-0 top-0 flex ml-auto mb-1"
              >
                <Icon icon="removeCart" />
              </button>
              <Image
                src={item.image}
                alt="cart-product"
                sizes="100vw"
                className="w-[115px] h-[121px] object-cover"
                width={115}
                height={121}
              />
              <div>
                <h2 className="!leading-130 text-base font-medium text-blacks-200">
                  {item.name}
                </h2>
                <div className="flex mt-2 justify-between items-end">
                  <div>
                    <span className="!leading-130 text-sm block font-semibold line-through text-blues-300/50">
                      ${item.oldPrice}
                    </span>
                    <p className="!leading-130 text-xl mt-0.5 font-semibold text-reds-900">
                      ${item.price}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      disabled={item.quantity === 1}
                      onClick={() => decreaseQuantity(index)}
                      className={`w-11 flex items-center justify-center h-11 rounded border border-white-100 ${
                        item.quantity === 1
                          ? "text-[#B3B3B3] pointer-events-none"
                          : "text-greens-900"
                      }`}
                    >
                      <Icon icon="minusCart" />
                    </button>
                    <p className="font-semibold text-blacks-200">
                      {item.quantity}
                    </p>
                    <button
                      onClick={() => increaseQuantity(index)}
                      className="w-11 flex items-center text-greens-900 justify-center h-11 rounded border border-white-100"
                    >
                      <Icon icon="plusCart" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="mt-10">
            <Image
              src="/assets/images/svg/alert.svg"
              width={87}
              height={87}
              alt="confirm"
              className="flex mx-auto mb-4 mt-10"
            />
            <p className="font-medium text-blacks-200 text-base text-center !leading-130">
              Nothing In Cart
            </p>
            <p className="font-medium capitalize text-[#666666] mx-auto text-center text-sm max-w-[239px] !leading-130">
              Go to product page and add Product
            </p>
          </div>
        )}
      </div>
      <CustomButton
        url="/customer"
        customClass=" py-3.5 text-center !border-transparent !text-greens-900 !bg-greens-900/10 hover:!bg-greens-900 hover:!text-white mt-8 w-full"
      >
        Add More Product
      </CustomButton>
      <Bill totalPrice={totalPrice} />
    </>
  );
};

export default CartCard;

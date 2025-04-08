import Icon from "@/components/common/Icons";
import Image from "next/image";
import React from "react";
import ProductCategory from "../../ProductCategory";
import { BEST_SELLER_LIST } from "@/utils/helper";
import { CustomButton } from "@/components/common/CustomButton";

const ProductDetails = () => {
  return (
    <div>
      <div className="border w-full  mx-auto h-[280px] border-greys-1300">
        <Image
          width={312}
          height={271}
          sizes="100vw"
          src="/assets/images/png/cart/powder.png"
          alt="powder"
          className="h-full mx-auto"
        />
      </div>
      <div className="mt-8 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <div className="border rounded-lg overflow-hidden w-[66px] h-[66px] border-greys-1300">
            <Image
              width={66}
              height={66}
              sizes="100vw"
              src="/assets/images/png/cart/powder.png"
              alt="#"
              className="h-full mx-auto"
            />
          </div>
          <div className="border rounded-lg overflow-hidden w-[66px] h-[66px] border-greys-1300">
            <Image
              width={66}
              height={66}
              sizes="100vw"
              src="/assets/images/png/cart/powder.png"
              alt="#"
              className="h-full mx-auto"
            />
          </div>
        </div>
        <div>
          <span className=" text-lg font-medium text-black leading-130">
            1.2 KM away
          </span>
          <div className="flex mt-3 justify-end items-center">
            {Array.from({ length: 5 }, (_, index) => (
              <span
                key={index}
                className={
                  index < Math.round(5) ? "text-yellows-200" : "text-greys-800"
                }
              >
                <Icon icon="star" />
              </span>
            ))}
          </div>
        </div>
      </div>
      <h2 className="text-lg mt-6 mb-3 font-medium text-black !leading-130">
        Arla DANO Full Cream Milk Powder Instant
      </h2>
      <div className="flex items-center justify-between">
        <p className="font-bold text-2xl text-blacks-200 !leading-130">1 KG</p>
        <p className="font-bold text-2xl text-greens-900 !leading-130">₹ 182</p>
      </div>
      <CustomButton customClass="mt-4 ml-auto">Add to Cart</CustomButton>
      <p className="text-base font-medium mt-4 text-blacks-200 !leading-130">
        Shop Location
      </p>
      <div className="flex items-center mt-4 gap-4">
        <Icon icon="locationShop" />
        <p className="text-sm font-normal !leading-130 text-greys-1200">
          Floor 4, Wakil Tower, Ta 131 Gulshan Badda Link Road
        </p>
      </div>

      <h2 className="text-xl font-semibold text-blacks-200 !leading-130 my-10">
        See Similar Products
      </h2>
      <ProductCategory productList={BEST_SELLER_LIST} />
    </div>
  );
};

export default ProductDetails;

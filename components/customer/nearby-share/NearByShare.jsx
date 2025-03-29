import { CustomButton } from "@/components/common/CustomButton";
import Icon from "@/components/common/Icons";
import { NEARBY_SHOP_LIST } from "@/utils/helper";
import Image from "next/image";
import React from "react";

const NearByShare = () => {
  return (
    <>
      {NEARBY_SHOP_LIST.map((obj, i) => (
        <div key={i} className="h-[175px] mt-6 shadow-category rounded-lg py-4 px-3">
          <div className="flex items-start gap-5">
            <Image
              src={obj.image}
              alt="shopImage"
              height={140}
              width={121}
              className="object-cover rounded w-[121px] h-[140px]"
            />
            <div className="w-full">
              <h2 className="text-lg leading-130 font-medium text-blacks-200 mb-2">
                {obj.name}
              </h2>
              <p className="text-lg leading-130 font-medium text-blacks-200">
                {obj.category}
              </p>
              <CustomButton
                url={obj.path}
                customClass="mt-2 w-fit text-sm mb-5"
              >
                View Shop
              </CustomButton>
              <div className="flex justify-between w-full items-center">
                {/* text-yellows-100 text-greys-800 */}
                {/* {obj.review} */}
                <div className="flex  items-center">
                  {Array.from({ length: 5 }, (_, index) => (
                    <span
                      key={index}
                      className={
                        index < Math.round(obj.review)
                          ? "text-yellows-100"
                          : "text-greys-800"
                      }
                    >
                      <Icon icon="star" />
                    </span>
                  ))}
                </div>
                <p className="text-reds-900 italic font-semibold text-xs !leading-130">
                  {obj.distance} away
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default NearByShare;

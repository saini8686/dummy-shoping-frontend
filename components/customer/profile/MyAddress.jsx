import Icon from "@/components/common/Icons";
import { USER_ADDRESSE_DATA } from "@/utils/helper";
import React from "react";

const MyAddress = () => {
  return (
    <>
      {USER_ADDRESSE_DATA.map((obj,i) => (
        <div className="flex gap-5 mt-4 justify-between border-b border-b-greys-900 pb-4  items-center">
          <div className="w-full">
            <h3 className="text-base  text-blacks-200 font-medium !leading-130">
              {obj.label}
            </h3>
            <input
              type="text"
              placeholder="51/5A, Road: 7, Pallabi, Dhaka"
              className="border-0 outline-0 text-sm w-full  text-greys-1200 font-normal mt-0.5 !leading-130 placeholder:text-greys-1200"
            />
          </div>
          <div className="flex gap-5 items-center">
            <button className="hover:invert duration-300">
              <Icon icon="pencilAddresse" />
            </button>
            <button className="hover:invert duration-300">
              <Icon icon="deleteAddresse" />
            </button>
          </div>
        </div>
      ))}
    </>
  );
};

export default MyAddress;

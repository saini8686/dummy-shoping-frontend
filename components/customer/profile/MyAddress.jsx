import Icon from "@/components/common/Icons";
import React from "react";

const MyAddress = () => {
  return (
    <div>
      <div>
        <h3 className="text-base  text-blacks-200 font-medium !leading-130">
          Home
        </h3>
        <p className="text-sm  text-greys-1200 font-normal mt-0.5 !leading-130">
          51/5A, Road: 7, Pallabi, Dhaka
        </p>
      </div>
      <div>
        <button>
          <Icon icon="" />
        </button>
        <button>
            <Icon icon="" />
        </button>
      </div>
    </div>
  );
};

export default MyAddress;

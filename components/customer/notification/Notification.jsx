import Icon from "@/components/common/Icons";
import { NOTIFICATION_LIST } from "@/utils/helper";
import React from "react";

const Notification = () => {
  return (
    <div className="mt-10">
      {NOTIFICATION_LIST.map((obj, i) => (
        <div
          key={i}
          className="pt-3 cursor-pointer px-5 mt-4 border-b border-b-greys-900 pb-5 hover:bg-greens-900/15 duration-300 hover:rounded-lg hover:border-b-transparent"
        >
          <div className="flex justify-between items-center">
            <p className="text-sm font-semibold text-blacks-200 !leading-130">
              Order #{obj.orderId}
            </p>
            <p className="text-sm font-semibold text-blacks-200 !leading-130">
              3:57 PM
            </p>
          </div>
          <div className="mt-1 flex items-center justify-between">
            <p className="max-w-[243px] text-sm font-semibold text-blacks-200 !leading-130">
              {obj.about}
            </p>
            <Icon icon={obj.icon} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Notification;

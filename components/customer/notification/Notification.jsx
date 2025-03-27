import Icon from "@/components/common/Icons";
import React from "react";

const Notification = () => {
  return (
    <div className="mt-10">
      <div className="pt-3 px-5 border-b border-b-greys-900 pb-5 hover:bg-greens-900/15 duration-300 hover:rounded-lg hover:border-b-transparent">
        <div className="flex justify-between items-center">
          <p className="text-sm font-semibold text-blacks-200 !leading-130">
            Order #345
          </p>
          <p className="text-sm font-semibold text-blacks-200 !leading-130">
            3:57 PM
          </p>
        </div>
        <div className="mt-1 flex items-center justify-between">
          <p className="max-w-[243px] text-sm font-semibold text-blacks-200 !leading-130">
            Your Order is Confirmed. Please check everything is okay
          </p>
          <Icon icon="checkNotification" />
        </div>
      </div>
    </div>
  );
};

export default Notification;

import { SHOPKEPPER_NOTIFICATION_LIST } from "@/utils/helper";
import React from "react";

const Notification = () => {
  return (
    <div>
      {SHOPKEPPER_NOTIFICATION_LIST.map((obj, i) => (
        <div className="py-2.5 px-2 border border-white-100 rounded-lg mt-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-base !leadingn-120 text-blacks-200">
              {obj.title}
            </h2>
            {obj.read && (
              <span className="size-4 block rounded-full bg-greens-900"></span>
            )}
          </div>
          <p className="text-sm !leading-130 line-clamp-1 text-greys-1200">
            {obj.diescription}
          </p>
          <p className="text-sm text-end !leading-130 text-greys-1200">
            {obj.time}
          </p>
        </div>
      ))}
    </div>
  );
};

export default Notification;

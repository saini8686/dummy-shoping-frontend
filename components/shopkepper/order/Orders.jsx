"use client";
import Icon from "@/components/common/Icons";
import { SHOPKEPPER_ORDER_LIST } from "@/utils/helper";
import { useSearchParams } from "next/navigation";
import React from "react";

const Orders = () => {
  const searchParams = useSearchParams();
  const order = searchParams.get("order");
  const filteredOrders = SHOPKEPPER_ORDER_LIST.filter((obj) => {
    if (!order || order === "all") return true; // show all if no filter or "all"
    return obj.category.toLowerCase().replace(/ /, "-") === order;
  });
  return (
    <div className="mt-10">
      {filteredOrders.map((obj, i) => (
        <div
          key={i}
          className="flex mt-6 pb-2.5 border-b border-white-100 justify-between items-center"
        >
          <div>
            <p>
              <span className="font-medium block text-sm !leading-130 text-greys-1500">
                Order ID {obj.orderId}
              </span>
              <span className="font-normal block text-sm !leading-130 text-greys-1400">
                {obj.time}
              </span>
            </p>
          </div>

          {!order || order === "all" ? (
            <p
              className={`py-1 px-2.5 text-sm font-medium !leading-130 
            ${
              obj.category === "New Order"
                ? "bg-greens-900 text-[#B9FFDD]"
                : obj.category === "Awaiting Pickup"
                ? "bg-[#FFA500]/20 text-[#FFA500]"
                : obj.category === "In Transit"
                ? "bg-[#0754EA]/20 text-[#0754EA]"
                : obj.category === "Complete"
                ? "bg-[#EAFFEA] text-[#324E32]"
                : obj.category === "Cancelled" && "bg-reds-900/20 text-reds-900"
            }
            `}
            >
              {obj.category}
            </p>
          ) : (
            <div className="flex items-center gap-1">
              <p className="text-sm font-normal text-greys-1400 !leading-130">
                {obj.item} items
              </p>
              <Icon icon="arrowNext" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Orders;

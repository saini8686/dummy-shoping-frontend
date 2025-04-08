"use client";
import { SHOPKEPPER_ORDER_FILTER } from "@/utils/helper";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const OrderTabList = () => {
  const searchParams = useSearchParams();
  const order = searchParams.get("order");
  return (
    <div className="flex gap-2.5 mt-4 scroll-none flex-nowrap overflow-scroll">
      {SHOPKEPPER_ORDER_FILTER.map((obj, i) => (
        <Link
          href={`?order=${obj.name.toLowerCase().replace(/ /, "-")}`}
          key={i}
          className={` ${
            order === obj.name.toLowerCase().replace(/ /, "-")
              ? "!bg-greens-900 border-transparent !text-white"
              : i === 0 &&
                !order &&
                "!bg-greens-900 border-transparent !text-white"
          } py-2 px-2.5 border text-nowrap hover:bg-greens-900 text-blacks-200 hover:text-white duration-300 border-greens-900 hover:border-transparent rounded`}
        >
          <p className="text-sm font-normal capitalize text-center  !leading-130">
            {obj.name}
          </p>
        </Link>
      ))}
    </div>
  );
};

export default OrderTabList;

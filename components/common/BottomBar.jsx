"use client";
import { BOTTOM_BAR_LIST } from "@/utils/helper";
import Link from "next/link";
import React from "react";
import Icon from "./Icons";
import { usePathname } from "next/navigation";
import UpiButton from "./UpiButton";

const BottomBar = () => {
  const pathName = usePathname();
  return (
    <div className="h-[59px] max-w-[540px] mx-auto bg-white rounded-t-lg py-4 z-10 w-full fixed shadow-bottom-bar left-1/2 -translate-x-1/2 bottom-0">
      <div className="flex gap-10 items-center justify-between px-4">
        {BOTTOM_BAR_LIST.map((obj, i) => (
          <Link
            key={i}
            href={obj.path}
            className={`text-black hover:text-greens-900 duration-300 ${
              obj.path === pathName && "text-greens-900"
            }`}
          >
            <Icon icon={obj.icon} />
          </Link>
        ))}
      <UpiButton />
      </div>
    </div>
  );
};

export default BottomBar;

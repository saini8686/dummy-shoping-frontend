import { BOTTOM_BAR_LIST } from "@/utils/helper";
import Link from "next/link";
import React from "react";
import Icon from "./Icons";

const BottomBar = () => {
  return (
    <div className="h-[59px] max-w-[640px] mx-auto bg-white rounded-t-lg py-4 z-10 w-full fixed shadow-bottom-bar left-1/2 -translate-x-1/2 bottom-0">
      <div className="flex gap-10 items-center justify-between px-4">
        {BOTTOM_BAR_LIST.map((obj, i) => (
          <Link key={i} href={obj.path} className="text-black hover:text-greens-900 duration-300">
            <Icon icon={obj.icon} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BottomBar;

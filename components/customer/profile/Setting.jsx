import Icon from "@/components/common/Icons";
import { SETTING_LIST } from "@/utils/helper";
import Link from "next/link";
import React from "react";

const Setting = () => {
  return (
    <div className="mt-10">
      {SETTING_LIST.map((obj, i) => (
        <Link href={obj.path} className="flex gap-2.5 border-b border-b-white-100 py-3 px-2.5 items-center">
          <span className="w-[44px] h-[44px] flex justify-center items-center">
            <Icon icon={obj.icon} />
          </span>
          <p className="text-blues-300 font-medium text-sm !leading-130">
            {obj.name}
          </p>
        </Link>
      ))}
    </div>
  );
};

export default Setting;

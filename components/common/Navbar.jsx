import Image from "next/image";
import React from "react";
import Icon from "./Icons";
import Link from "next/link";
const Navbar = () => {
  return (
    <div className="pt-8 pb-4 rounded-b-3xl  bg-greens-900 px-4">
      <Image
        src="/assets/images/svg/logo.svg"
        width={86}
        height={39}
        sizes="100vw"
        className="mb-5 w-[86px] h-[39px] object-cover"
        alt="logo"
      />
      <div className="flex justify-between gap-5 items-center">
        <div className="flex items-center gap-1">
          <span className="bg-white rounded-full flex justify-center items-center min-w-[34px] h-[34px]">
            <Icon icon="locationNavbar" />
          </span>
          <p className="text-white font-roboto font-medium block text-sm !leading-130">
            <span className="block font-roboto">HOME</span>
            <span className="block font-roboto mt-0.5">
              Sultan Bhag, Erraga...
            </span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="#"
            className="bg-white flex rounded-full justify-center items-center min-w-[34px] h-[34px]"
          >
            <Icon icon="notification" />
          </Link>
          <Link
            href="#"
            className="bg-white flex rounded-full justify-center items-center min-w-[34px] h-[34px]"
          >
            <Icon icon="profile" />
          </Link>
        </div>
      </div>
      <p className="text-lg text-white font-roboto mt-4 font-medium !leading-130">
        Your Order will be packed in 11 minutes
      </p>
    </div>
  );
};

export default Navbar;

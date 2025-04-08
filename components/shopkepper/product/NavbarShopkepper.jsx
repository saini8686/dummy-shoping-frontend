"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import useAuthStore from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import Icon from "@/components/common/Icons";
const NavbarShopkepper = () => {
  const router = useRouter();
  return (
    <div className="pt-8 pb-4 rounded-b-3xl bg-greens-900 px-4 relative">
      <div className="flex justify-between items-center">
        <button
          onClick={() => router.back()}
          className="border-0 outline-0 bg-transparent"
        >
          <Icon icon="back" className="invert" />
        </button>
        <Link href="/customer">
          <Image
            src="/assets/images/svg/logo.svg"
            width={86}
            height={39}
            sizes="100vw"
            className="w-[85px] h-[32px] object-cover"
            alt="logo"
          />
        </Link>
      </div>
      <div className="flex justify-between gap-5 mt-7 items-center">
        <div className="flex items-center gap-2">
          <Image
            src="/assets/images/png/shopkepper/basic-detail-profile.png"
            width={51}
            height={51}
            sizes="100vw"
            className="w-[51px] h-[51px] object-cover"
            alt="logo"
          />
          <p className="text-white font-medium block text-base !leading-130">
            <span className="block">Hello Emekus</span>
            <span className="block text-sm text-white/70 mt-0.5">
              Let’s make sales today
            </span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/shopkepper/notification"
            className="bg-white flex rounded-full justify-center items-center min-w-[34px] h-[34px]"
          >
            <Icon icon="notification" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NavbarShopkepper;

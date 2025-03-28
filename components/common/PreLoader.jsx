"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

import { useSearchParams } from "next/navigation";
import InstructionStep from "../login-steps/InstructionStep";
import SelectRole from "../login-steps/SelectRole";
import LoginOptions from "../login-steps/LoginOptions";
import Icon from "./Icons";
import Link from "next/link";
const PreLoader = () => {
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const searchParams = useSearchParams();
  let steps = searchParams.get("steps");
  if (!steps) {
    steps = "0";
  }
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, [loading]);

  return (
    <div>
      {loading && (
        <div className="w-full max-w-[540px] flex justify-center items-center mx-auto min-h-screen bg-white fixed inset-0 z-[51]">
          <Image
            src="/assets/images/svg/main-logo.svg"
            width={205}
            height={97}
            sizes="100vw"
            className="mb-5  w-[205px] mx-auto h-[97px] object-cover"
            alt="logo"
          />
        </div>
      )}
      {/* show */}
      <div className="w-full max-w-[540px] mx-auto min-h-screen bg-white fixed inset-0 z-50">
        <div className="relative justify-between gap-10 flex-col flex z-10 min-h-screen">
          <div className="mt-10 px-4 flex w-full  justify-between items-center">
            {steps === "0" && (
              <p className="text-lg font-semibold text-black !leading-130">
                {activeIndex + 1}
                <span className="text-greys-600">/3</span>
              </p>
            )}
            {steps != "0" && (
              <Link
                href={
                  steps === "0"
                    ? "?steps=0"
                    : steps === "1"
                    ? "?steps=0"
                    : "?steps=1"
                }
              >
                <Icon icon="back" />
              </Link>
            )}
            {steps === "0" && (
              <Link
                href="?steps=1"
                className="text-reds-900 font-semibold text-xl !!leading-130"
              >
                Skip
              </Link>
            )}
          </div>
          <Image
            src="/assets/images/svg/main-logo.svg"
            width={205}
            height={97}
            sizes="100vw"
            className="mb-5  w-[205px] mx-auto h-[97px] object-cover"
            alt="logo"
          />
          <div className="bg-greens-900 landing_hero_swiper rounded-t-3xl h-[300px] mt-[]  w-full pt-[56px] pb-6 px-7">
            {steps === "0" ? (
              <InstructionStep
                activeIndex={activeIndex}
                setActiveIndex={setActiveIndex}
              />
            ) : steps === "1" ? (
              <SelectRole />
            ) : (
              <LoginOptions />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreLoader;

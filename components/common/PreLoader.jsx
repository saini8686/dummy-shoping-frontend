"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

import InstructionStep from "../login-steps/InstructionStep";
import SelectRole from "../login-steps/SelectRole";
import LoginOptions from "../login-steps/LoginOptions";
import Cookies from "js-cookie";

const PreLoader = () => {
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();
  let steps = searchParams.get("steps") || "0";

  // ✅ Check auth on load
  useEffect(() => {
    const token = Cookies.get("token");
    const userRole = Cookies.get("userRole");

    if (token && userRole) {
      switch (userRole.toLowerCase()) {
        case "admin":
          router.replace("/admin/user-list");
          break;
        case "shopkepper":
          router.replace("/shopkepper/product");
          break;
        case "customer":
          router.replace("/customer");
          break;
        default:
          router.replace("/sign-in");
      }
    }
  }, [router]);

  // Preloader effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      {loading && (
        <div className="w-full max-w-[540px] flex justify-center items-center mx-auto min-h-screen bg-white fixed inset-0 z-[51]">
          <Image
            src="/assets/images/svg/main-logo.svg"
            width={205}
            height={97}
            sizes="100vw"
            className="mb-5 w-fit mx-auto h-[71px] object-cover"
            alt="logo"
          />
        </div>
      )}

      {/* Main content */}
      <div className="w-full max-w-[540px] mx-auto min-h-screen bg-white fixed inset-0 z-50">
        <div className="relative justify-between gap-10 flex-col flex z-10 min-h-screen pt-10">
          <Image
            src="/assets/images/svg/main-logo.svg"
            width={205}
            height={97}
            sizes="100vw"
            className="mb-5 w-fit mx-auto h-[73px] object-cover"
            alt="logo"
          />

          <div className="bg-greens-900 landing_hero_swiper rounded-t-3xl h-[400px] w-full pt-[56px] pb-6 px-7">
            {steps === "0" || steps === "1" ? <SelectRole /> : <LoginOptions />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreLoader;

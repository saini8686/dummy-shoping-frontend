"use client";
import Image from "next/image";
import React, { useState } from "react";
import Icon from "./Icons";
import Link from "next/link";
import useAuthStore from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { Copy } from "lucide-react"; // 👈 Use lucide-react icon
import { toast, ToastContainer } from "react-toastify"; // 👈 Toast for feedback

const Navbar = ({ userInfo }) => {
  const { user, signOut } = useAuthStore();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  const displayName = userInfo?.name || "User";
  const userEmail = userInfo?.email || "";
  const referralCode = userInfo?.referralCode || "";

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
    console.log("Toggle Profile Menu");
    console.log("Auth User:", user);
    console.log("Display Name:", displayName);
    console.log("Email:", userEmail);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setShowProfileMenu(false);
      router.push("/sign-in");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleCopyReferral = () => {
    if (!referralCode) return;
    const urlWithReferral = `${referralCode}`;
    navigator.clipboard.writeText(urlWithReferral);
    setCopied(true);
    toast.success("Referral code copied!");
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="pt-8 pb-4 rounded-b-3xl bg-greens-900 px-4 relative">
      {/* Top Logo + Referral */}
      <ToastContainer />
      <div className="flex justify-between gap-5 items-start">
        <Link href="/customer">
          <Image
            src="/assets/images/svg/logo.svg"
            width={100}
            height={39}
            sizes="100vw"
            className="mb-5 h-[32px] object-cover"
            alt="logo"
          />
        </Link>
        {referralCode && (
          <div
            onClick={handleCopyReferral}
            className="flex items-center gap-1 cursor-pointer group font-bold"
          >
            <span className="block font-roboto mt-0.5 text-white text-sm">
              {referralCode}
            </span>
            <Copy
              size={18}
              className="text-white group-hover:text-green-300 transition"
            />
          </div>
        )}
      </div>

      {/* Location + Icons */}
      <div className="flex justify-between gap-5 items-center">
        <div className="flex items-center gap-1">
          <span className="bg-white rounded-full flex justify-center items-center min-w-[34px] h-[34px]">
            <Icon icon="locationNavbar" />
          </span>
          <p className="text-white font-roboto font-medium block text-sm !leading-130">
            <span className="block font-roboto">HOME</span>
            <span className="block font-roboto mt-0.5">
              {Cookies.get("address") || "Your Location"}
            </span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/customer/notification"
            className="bg-white flex rounded-full justify-center items-center min-w-[34px] h-[34px]"
          >
            <Icon icon="notification" />
          </Link>
          <Link
            href="/customer/profile"
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

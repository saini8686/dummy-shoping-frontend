"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import Icon from "./Icons";
import Link from "next/link";
import useAuthStore from "@/store/useAuthStore";
import useUserStore from "@/store/useUserStore";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const { user, signOut } = useAuthStore();
  const { userData, loading, fetchUserByUid } = useUserStore();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const router = useRouter();

  // Fetch user data when component mounts if we have a user but no userData
  useEffect(() => {
    if (user && !userData && user.uid) {
      console.log("Fetching user data in Navbar for:", user.uid);
      fetchUserByUid(user.uid);
    }
  }, [user, userData, fetchUserByUid]);

  // Display user's name or email if available
  const displayName = userData?.displayName || user?.displayName || "User";
  const userEmail = userData?.email || user?.email || "";

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
    console.log("Toggle Profile Menu");
    console.log("User Data:", userData);
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

  return (
    <div className="pt-8 pb-4 rounded-b-3xl bg-greens-900 px-4 relative">
      <Link href="/customer">
        <Image
          src="/assets/images/svg/logo.svg"
          width={86}
          height={39}
          sizes="100vw"
          className="mb-5 w-[86px] h-[39px] object-cover"
          alt="logo"
        />
      </Link>
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
            href="/customer/notification"
            className="bg-white flex rounded-full justify-center items-center min-w-[34px] h-[34px]">
            <Icon icon="notification" />
          </Link>
          <Link
            href="#"
            onClick={toggleProfileMenu}
            className="bg-white flex rounded-full justify-center items-center min-w-[34px] h-[34px]">
            <Icon icon="profile" />
          </Link>
        </div>
      </div>

      {/* User profile dropdown */}
      {showProfileMenu && (
        <div className="absolute right-4 top-32 bg-white shadow-lg rounded-md p-3 z-10 min-w-[200px]">
          <div className="flex flex-col">
            <div className="border-b pb-2 mb-2">
              <p className="font-medium text-gray-800">{displayName}</p>
              <p className="text-sm text-gray-500">{userEmail}</p>
            </div>
            {userData?.appId && (
              <p className="text-sm text-gray-700 mb-2">
                App ID: {userData.appId}
              </p>
            )}
            <Link
              href="/profile"
              className="text-greens-900 hover:underline mb-1">
              My Profile
            </Link>
            <Link
              href="/settings"
              className="text-greens-900 hover:underline mb-1">
              Settings
            </Link>
            <Link
              href="/change-password"
              className="text-greens-900 hover:underline mb-1">
              Change Password
            </Link>
            <button
              onClick={handleSignOut}
              className="text-red-500 hover:underline pt-2 border-t text-left">
              Sign Out
            </button>
          </div>
        </div>
      )}

      <p className="text-lg text-white font-roboto mt-4 font-medium !leading-130">
        Your Order will be packed in 11 minutes
      </p>
    </div>
  );
};

export default Navbar;

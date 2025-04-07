"use client";
import useAuthStore from "@/store/useAuthStore";
import useUserStore from "@/store/useUserStore";
import Image from "next/image";
import React, { useEffect } from "react";

const UserInfo = () => {
  const { user } = useAuthStore();
  const { userData, fetchUserByUid } = useUserStore();
  useEffect(() => {
    if (user && !userData && user.uid) {
      console.log("Fetching user data in Navbar for:", user.uid);
      fetchUserByUid(user.uid);
    }
  }, [user, userData, fetchUserByUid]);

  return (
    <div className="flex gap-4 items-center">
      <Image
        src="/assets/images/png/profile/avtar.png"
        width={50}
        height={50}
        sizes="100vw"
        className="w-[50px] rounded-full h-[50px] object-contain"
        alt="user"
      />
      <p>
        <span className="font-semibold block text-blacks-200 !leading-130">
          {userData?.displayName|| 'Jhon doe'}
        </span>
        <span className="text-sm font-medium block !leading-130 text-greys-1100">
          {userData?.appId||'00009xxxx'}
        </span>
      </p>
    </div>
  );
};

export default UserInfo;

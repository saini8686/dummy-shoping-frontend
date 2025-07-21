"use client";
import Image from "next/image";

const UserInfo = () => {
  // const { userInfo } = params;
  // console.log(userInfo.name);

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
          {"Jhon doe"}
          {/* {userInfo.name ?? "Jhon doe"} */}
        </span>
        <span className="text-sm font-medium block !leading-130 text-greys-1100">
          {"00009xxxx"}
        </span>
      </p>
    </div>
  );
};

export default UserInfo;

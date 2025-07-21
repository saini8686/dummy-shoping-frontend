"use client";
import { CustomButton } from "@/components/common/CustomButton";
import Icon from "@/components/common/Icons";
import { USER_PROFILE_DATA } from "@/utils/helper";
import Image from "next/image";
import React, { useState } from "react";

const UserData = (params) => {
  const { userInfo } = params
  const [userProfile, setUserProfile] = useState({
    imageSrc: "/assets/images/png/profile/avtar.png",
    fullName: "Robert Miles",
    number: 1234567890,
    password: "ddkasjdla",
  });
  const [password, setPassword] = useState(false);
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserProfile({ ...userProfile, imageSrc: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted with data:", userProfile);
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="relative mb-[50px] w-fit mx-auto">
          <Image
            src={userProfile.imageSrc}
            width={129}
            height={129}
            sizes="100vw"
            className="w-[129px] rounded-full h-[129px] object-cover object-top"
            alt="user"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            id="avatar-upload"
          />
          <span className="w-11 h-11 cursor-pointer hover:bg-white hover:!text-reds-900 duration-300 rounded-full absolute bottom-0 right-0 flex justify-center items-center text-white bg-reds-900">
            <label htmlFor="avatar-upload" className="cursor-pointer">
              <Icon icon="camera" />
            </label>
          </span>
        </div>
        {USER_PROFILE_DATA.map((obj, i) => (
          <div
            key={i}
            className="bg-white-200 relative mt-3.5 rounded-lg gap-2.5 py-2.5 flex px-3 w-full"
          >
            <span className="h-11 flex justify-center items-center w-11">
              <Icon icon={obj.icon} />
            </span>
            <div>
              <p className="text-xs text-greys-dark-400 !leading-130">
                {obj.label}
              </p>
              <input
                type={password && obj.type === "password" ? "text" : obj.type}
                value={userProfile[obj.name]}
                onChange={(e) =>
                  setUserProfile({ ...userProfile, [obj.name]: e.target.value })
                }
                className="border-0 outline-0 bg-transparent text-greys-dark-400 placeholder:text-greys-dark-400"
                placeholder={obj.label}
              />
            </div>
            {obj.type === "password" && (
              <span
                onClick={() => setPassword(!password)}
                className="absolute cursor-pointer top-1/2 right-3 -translate-y-1/2"
              >
                <Icon icon="eyeOpen" />
              </span>
            )}
          </div>
        ))}
        <CustomButton isSubmit customClass="w-full py-3.5 mt-8">
          Save Changes
        </CustomButton>
      </form>
    </div>
  );
};

export default UserData;

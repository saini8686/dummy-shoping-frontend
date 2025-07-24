"use client";
import { CustomButton } from "@/components/common/CustomButton";
import Icon from "@/components/common/Icons";
import { USER_PROFILE_DATA } from "@/utils/helper";
import Image from "next/image";
import React, { useState, useEffect, use } from "react";
import Cookies from "js-cookie";
import { uploadImageToServer, updateUser } from "@/services/users.service"; // ✅ make sure this exists

const UserData = ({ userInfo }) => {
  const [userProfile, setUserProfile] = useState({
    imageSrc: "/assets/images/png/profile/avtar.png",
    fullName: "",
    number: "",
    password: "",
  });
  const [password, setPassword] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    if (userInfo) {
      setUserProfile({
        imageSrc: userInfo?.profilePicture || "/assets/images/png/profile/avtar.png",
        fullName: userInfo?.name || "",
        number: userInfo?.number || "",
        password: "********",
      });
    }
  }, [userInfo]);

  const handleImageChange = (e) => {
    console.log("Image change event:", e);
    
    const file = e.target.files[0];
    console.log("Selected file:", file);
    
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserProfile((prev) => ({
          ...prev,
          imageSrc: reader.result,
        }));
      };
      console.log("Selected file:", userProfile);
      
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    const userId = Cookies.get("userId");
    const token = Cookies.get("token");

    if (!userId || !token) {
      alert("User not authenticated.");
      return;
    }

    if (!imageFile) {
      alert("Please select an image first.");
      return;
    }

    try {
      const result = await uploadImageToServer(
        imageFile,
        userId,
        "user",
        "profilePicture"
      );

      if (result?.url) {
        setUserProfile((prev) => ({
          ...prev,
          imageSrc: result.url,
        }));

        // ✅ Update user profile with new image URL
        // await updateUser({
        //   ...userProfile,
        //   profilePicture: result.url,
        // });

        alert("Profile image uploaded and updated successfully!");
      } else {
        alert("Upload succeeded but no image URL returned.");
      }
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload profile image.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await updateUser(userProfile);

      if (!response.ok && !response.success) {
        throw new Error("Update failed");
      }

      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Update failed:", error);
      alert("Failed to update profile.");
    }
  };

const getImageSrc = () => {
  const { imageSrc } = userProfile;

  // Fallback to default avatar if imageSrc is null or empty
  if (!imageSrc || imageSrc === "null") {
    return "/assets/images/png/profile/avtar.png";
  }

  // If imageSrc is a data URL or a full URL, return as-is
  if (imageSrc.startsWith("data:image") || imageSrc.startsWith("http")) {
    return imageSrc;
  }

  // Prepend API base URL for relative paths
  return `${process.env.NEXT_PUBLIC_API_BASE}${imageSrc}`;
};


  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="relative mb-[50px] w-fit mx-auto">
          <img
            src={getImageSrc()}
            width={129}
            height={129}
            sizes="100vw"
            className="w-[129px] rounded-full h-[129px] object-cover object-top"
            alt="user profile"
            priority
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

        <CustomButton
          type="button"
          onClick={handleUpload}
          customClass="w-full py-[11px] mt-3"
        >
          Upload Profile Image
        </CustomButton>

        {USER_PROFILE_DATA.map((obj, i) => (
          <div
            key={i}
            className="bg-white-200 relative mt-3.5 rounded-lg gap-2.5 py-2.5 flex px-3 w-full"
          >
            <span className="h-11 flex justify-center items-center w-11">
              <Icon icon={obj.icon} />
            </span>
            <div className="flex-1">
              <p className="text-xs text-greys-dark-400 !leading-130">
                {obj.label}
              </p>
              <input
                type={password && obj.type === "password" ? "text" : obj.type}
                value={userProfile[obj.name]}
                onChange={(e) =>
                  setUserProfile({ ...userProfile, [obj.name]: e.target.value })
                }
                className="w-full border-0 outline-0 bg-transparent text-greys-dark-400 placeholder:text-greys-dark-400"
                placeholder={obj.label}
                disabled={obj.name === "password"}
              />
            </div>
            {obj.type === "password" && (
              <span
                onClick={() => setPassword(!password)}
                className="absolute cursor-pointer top-1/2 right-3 -translate-y-1/2"
              >
                <Icon icon={password ? "eyeOpen" : "eyeClose"} />
              </span>
            )}
          </div>
        ))}

        <CustomButton type="submit" customClass="w-full py-3.5 mt-8">
          Save Changes
        </CustomButton>
      </form>
    </div>
  );
};

export default UserData;

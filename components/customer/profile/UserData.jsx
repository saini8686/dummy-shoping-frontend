"use client";
import React, { useState, useEffect, useRef } from "react";
import { CustomButton } from "@/components/common/CustomButton";
import Icon from "@/components/common/Icons";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import { uploadImageToServer, updateUser } from "@/services/users.service";
import { USER_PROFILE_DATA } from "@/utils/helper";

const UserData = ({ userInfo }) => {
  const [userProfile, setUserProfile] = useState({
    imageSrc: "/asset/images/png/profile/avtar.png",
    fullName: "",
    number: "",
    address: "",
  });

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (userInfo) {
      setUserProfile({
        imageSrc: userInfo?.profilePicture || "/assets/images/png/profile/avtar.png",
        fullName: userInfo?.name || "",
        number: userInfo?.number || "",
        address: userInfo?.address || "",
      });
    }
  }, [userInfo]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const imageUrl = URL.createObjectURL(file);
      setUserProfile((prev) => ({
        ...prev,
        imageSrc: imageUrl,
      }));
    }
  };

  const handleUpload = async () => {
    const userId = Cookies.get("userId");
    const token = Cookies.get("token");

    if (!userId || !token) {
      toast.error("User not authenticated.");
      return;
    }

    if (!imageFile) {
      toast.warn("Please select an image first.");
      return;
    }

    setLoadingProfile(true);
    try {
      const result = await uploadImageToServer(imageFile, userId, "user", "profilePicture");
      if (result) {
        toast.success("Profile image uploaded successfully.");
      } else {
        toast.error("Server did not return a success response.");
      }
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Failed to upload profile image.");
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedData = {
      ...userInfo,
      name: userProfile.fullName,
      number: userProfile.number,
      address: userProfile.address,
    };

    setLoading(true);
    try {
      const response = await updateUser(updatedData);
      if (!response) throw new Error("Update failed");
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const getImageSrc = () => {
    const { imageSrc } = userProfile;
    if (!imageSrc || imageSrc === "null") {
      return "/assets/images/png/profile/avtar.png";
    }
    if (imageSrc.startsWith("data:image") || imageSrc.startsWith("http") || imageSrc.startsWith("blob:")) {
      return imageSrc;
    }
    return `${process.env.NEXT_PUBLIC_API_BASE?.replace(/\/$/, "")}/${imageSrc}`;
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <ToastContainer />
      <form>
        <div className="relative mb-[50px] w-fit mx-auto">
          <img
            src={getImageSrc()}
            width={129}
            height={129}
            className="w-[129px] rounded-full h-[129px] object-cover object-top"
            alt="user profile"
          />
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
          />
          <span
            className="w-11 h-11 cursor-pointer hover:bg-white hover:!text-reds-900 duration-300 rounded-full absolute bottom-0 right-0 flex justify-center items-center text-white bg-reds-900"
            onClick={triggerFileInput}
          >
            <Icon icon="camera" />
          </span>
        </div>

        <CustomButton
          type="button"
          onClick={handleUpload}
          disabled={loadingProfile}
          customClass="w-full py-[11px] mt-3"
        >
          {loadingProfile ? "Uploading..." : "Upload Profile Image"}
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
                type={obj.type === "password" && passwordVisible ? "text" : obj.type}
                value={userProfile[obj.name]}
                onChange={(e) =>
                  setUserProfile({ ...userProfile, [obj.name]: e.target.value })
                }
                className="w-full border-0 outline-0 bg-transparent text-greys-dark-400 placeholder:text-greys-dark-400"
                placeholder={obj.label}
              />
            </div>
            {obj.type === "password" && (
              <span
                onClick={() => setPasswordVisible(!passwordVisible)}
                className="absolute cursor-pointer top-1/2 right-3 -translate-y-1/2"
              >
                <Icon icon={passwordVisible ? "eyeOpen" : "eyeClose"} />
              </span>
            )}
          </div>
        ))}

        <CustomButton
          type="submit"
          onClick={handleSubmit}
          disabled={loading}
          customClass="w-full py-3.5 mt-8"
        >
          {loading ? "Saving..." : "Save Changes"}
        </CustomButton>
      </form>
    </div>
  );
};

export default UserData;

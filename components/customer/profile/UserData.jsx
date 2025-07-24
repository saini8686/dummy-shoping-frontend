"use client";
import { CustomButton } from "@/components/common/CustomButton";
import Icon from "@/components/common/Icons";
import { USER_PROFILE_DATA } from "@/utils/helper";
import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { uploadImageToServer, updateUser } from "@/services/users.service";
import { ToastContainer, toast } from "react-toastify";

const UserData = ({ userInfo }) => {
  const [userProfile, setUserProfile] = useState({
    imageSrc: "/asset/images/png/profile/avtar.png",
    fullName: "",
    number: "",
    password: "",
    address: "",
  });

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userInfo) {
      setUserProfile({
        imageSrc: userInfo?.profilePicture || "/assets/images/png/profile/avtar.png",
        fullName: userInfo?.name || "",
        number: userInfo?.number || "",
        password: "",
        address: userInfo?.address || "",
      });
    }
  }, [userInfo]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserProfile((prev) => ({
          ...prev,
          imageSrc: reader.result,
        }));
      };
      reader.readAsDataURL(file);
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

    setLoading(true);
    try {
      const result = await uploadImageToServer(imageFile, userId, "user", "profilePicture");
      if (!result || !result.ok) {
        toast.success("Profile image uploaded successfully.");
      }
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Failed to upload profile image.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedData = {
      ...userInfo,
      name: userProfile.fullName,
      number: userProfile.number,
      password: userProfile.password,
      address: userProfile.address,
    };

    setLoading(true);
    try {
      console.log("fetching user with updated data:", updatedData);
      
      const response = await updateUser(updatedData);

      if (!response || !response.ok) {
        throw new Error("Update failed");
      }

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

    if (imageSrc.startsWith("data:image") || imageSrc.startsWith("http")) {
      return imageSrc;
    }

    return `${process.env.NEXT_PUBLIC_API_BASE}${imageSrc}`;
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
          disabled={loading}
          customClass="w-full py-[11px] mt-3"
        >
          {loading ? "Uploading..." : "Upload Profile Image"}
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

"use client";

import { useState, useEffect } from "react";
import CustomUploadImage from "./CustomUploadImage";
import Link from "next/link";
import Icon from "@/components/common/Icons";
import { getUser, uploadImageToServer } from "@/services/users.service";
import Cookies from "js-cookie";
import { CustomButton } from "@/components/common/CustomButton";
import { ToastContainer, toast } from "react-toastify";

const UploadShopImage = () => {
  const [imageFiles, setImageFiles] = useState({
    shopFront: null,
    counterView: null,
    other: null,
  });

  const [imagePreviews, setImagePreviews] = useState({
    shopFront: null,
    counterView: null,
    other: null,
  });

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const userId = Cookies.get("userId");
      const token = Cookies.get("token");

      if (!userId || !token) {
        toast.error("User ID or token not found in cookies.");
        return;
      }

      try {
        const userData = await getUser(userId, token);
        setUser(userData);
      } catch (error) {
        toast.error("Failed to fetch user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleImageUpload = (key, file) => {
    const previewURL = URL.createObjectURL(file);
    setImageFiles(prev => ({ ...prev, [key]: file }));
    setImagePreviews(prev => ({ ...prev, [key]: previewURL }));
  };

  const handleAllUploads = async () => {
    const userId = Cookies.get("userId");
    const token = Cookies.get("token");

    if (!user || !userId || !token) {
      toast.error("Please login to upload images");
      return;
    }

    // Check if at least one image is selected
    if (!imageFiles.shopFront && !imageFiles.counterView) {
      toast.error("Please upload at least shop front and counter view images");
      return;
    }

    setUploading(true);

    try {
      // Upload shop front image if selected
      if (imageFiles.shopFront) {
        await uploadImageToServer(
          imageFiles.shopFront,
          userId,
          "user",
          "shop_front_url"
        );
      }

      // Upload counter view image if selected
      if (imageFiles.counterView) {
        await uploadImageToServer(
          imageFiles.counterView,
          userId,
          "user",
          "shop_counter_url"
        );
      }

      // Upload other image if selected
      if (imageFiles.other) {
        await uploadImageToServer(
          imageFiles.other,
          userId,
          "user",
          "other_img_url"
        );
      }

      toast.success("Images uploaded successfully!");
    } catch (error) {
      toast.error("Failed to upload images");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-xl mx-auto">
        <p className="text-center py-10">Loading user data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto">
      <ToastContainer />
      <h2 className="text-xl font-semibold pb-3.5 text-greens-900">
        Upload Shop Images
      </h2>

      {/* Shop Front View */}
      <CustomUploadImage
        name="Shop Front View"
        image={imagePreviews.shopFront}
        onChange={(file) => handleImageUpload("shopFront", file)}
      />

      {/* Shop Counter View */}
      <CustomUploadImage
        name="Shop Counter View"
        image={imagePreviews.counterView}
        onChange={(file) => handleImageUpload("counterView", file)}
      />

      {/* Other Images */}
      <CustomUploadImage
        name="Other Images (Optional)"
        image={imagePreviews.other}
        onChange={(file) => handleImageUpload("other", file)}
      />

      {/* Single Upload Button */}
      <CustomButton
        onClick={handleAllUploads}
        disabled={uploading || (!imageFiles.shopFront && !imageFiles.counterView)}
        customClass={`w-full py-[11px] mt-6 ${uploading ? "opacity-70 cursor-not-allowed" : ""
          }`}
      >
        {uploading ? "Uploading..." : "Upload All Images"}
      </CustomButton>

      {/* Navigation */}
      <Link
        href="/shopkepper/order"
        className="text-greens-900 text-xl font-medium flex justify-center items-center gap-2 mt-6 group"
      >
        Next
        <span className="group-hover:translate-x-1 duration-300">
          <Icon icon="nextMove" />
        </span>
      </Link>
    </div>
  );
};

export default UploadShopImage;
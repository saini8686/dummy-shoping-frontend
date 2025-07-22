"use client";

import { useState, useEffect } from "react";
import CustomUploadImage from "./CustomUploadImage";
import QrCode from "./QrCode";
import Link from "next/link";
import Icon from "@/components/common/Icons";
import { getUser, uploadImageToServer } from "@/services/users.service";
import Cookies from "js-cookie";
import { CustomButton } from "@/components/common/CustomButton";

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

  useEffect(() => {
    const fetchUser = async () => {
      const userId = Cookies.get("userId");
      const token = Cookies.get("token");

      if (!userId || !token) {
        console.error("User ID or token not found in cookies.");
        return;
      }

      try {
        const userData = await getUser(userId, token);
        setUser(userData);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleImageUpload = (key, file) => {
    const previewURL = URL.createObjectURL(file);
    setImageFiles((prev) => ({ ...prev, [key]: file }));
    setImagePreviews((prev) => ({ ...prev, [key]: previewURL }));
  };

  const handleUpload = async (imageKey, fieldName) => {
    const userId = Cookies.get("userId");
    const token = Cookies.get("token");

    if (!user || !userId || !token) {
      alert("User not authenticated.");
      return;
    }

    const file = imageFiles[imageKey];
    if (!file) {
      alert(`Please select an image for ${fieldName.replace(/_/g, ' ')}.`);
      return;
    }

    try {
      const uploadedUrl = await uploadImageToServer(file, userId, "user", fieldName);
      console.log(`${fieldName} uploaded to:`, uploadedUrl);
      alert(`${fieldName.replace(/_/g, ' ')} uploaded successfully.`);
    } catch (error) {
      console.error(`${fieldName} upload failed:`, error);
      alert(`Failed to upload ${fieldName.replace(/_/g, ' ')}.`);
    }
  };

  if (loading) return <p className="text-center">Loading user...</p>;

  return (
    <div className="max-w-xl mx-auto">
      <h2 className="text-xl font-semibold pb-3.5 text-greens-900">Upload Shop Images</h2>

      {/* Shop Front View */}
      <CustomUploadImage
        name="Shop Front View"
        image={imagePreviews.shopFront}
        onChange={(file) => handleImageUpload("shopFront", file)}
      />
      <CustomButton
        onClick={() => handleUpload("shopFront", "shop_front_url")}
        customClass="w-full py-[11px] mt-3"
      >
        Upload Shop Front Image
      </CustomButton>

      {/* Shop Counter View */}
      <CustomUploadImage
        name="Shop Counter View"
        image={imagePreviews.counterView}
        onChange={(file) => handleImageUpload("counterView", file)}
      />
      <CustomButton
        onClick={() => handleUpload("counterView", "shop_counter_url")}
        customClass="w-full py-[11px] mt-3"
      >
        Upload Counter View Image
      </CustomButton>

      {/* Other Images */}
      <CustomUploadImage
        name="Other Images (Optional)"
        image={imagePreviews.other}
        onChange={(file) => handleImageUpload("other", file)}
      />
      <CustomButton
        onClick={() => handleUpload("other", "other_img_url")}
        customClass="w-full py-[11px] mt-3"
      >
        Upload Other Image
      </CustomButton>

      {/* QR Code */}
      {/* <h2 className="text-xl font-semibold mt-10 text-greens-900">QR Scanner for Shop Identity</h2>
      <QrCode /> */}

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

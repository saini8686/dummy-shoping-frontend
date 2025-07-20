"use client";

import { useState, useEffect } from "react";
import CustomUploadImage from "./CustomUploadImage";
import QrCode from "./QrCode";
import Link from "next/link";
import Icon from "@/components/common/Icons";
import { getUser, updateUser, uploadImageToServer } from "@/services/users.service";
import Cookies from "js-cookie";

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

  const handleSubmit = async () => {
    const userId = Cookies.get("userId");
    const token = Cookies.get("token");

    if (!user || !userId || !token) {
      alert("User not authenticated.");
      return;
    }

    try {
      const shop_front_url = imageFiles.shopFront
        ? await uploadImageToServer(imageFiles.shopFront, userId)
        : user.shop_front_url;

      const shop_counter_url = imageFiles.counterView
        ? await uploadImageToServer(imageFiles.counterView, userId)
        : user.shop_counter_url;

      const other_img_url = imageFiles.other
        ? await uploadImageToServer(imageFiles.other, userId)
        : user.other_img_url;

      const payload = {
        userId,
        shop_front_url,
        shop_counter_url,
        other_img_url,
      };

      await updateUser(payload);
      alert("Shop images uploaded successfully.");
    } catch (error) {
      console.error("Image upload failed:", error);
      alert("Failed to upload images.");
    }
  };

  if (loading) return <p className="text-center">Loading user...</p>;

  return (
    <div>
      <h2 className="text-xl font-semibold pb-3.5 text-greens-900">
        Upload Shop Images
      </h2>

      <CustomUploadImage
        name="Shop Front View"
        image={imagePreviews.shopFront}
        onChange={(file) => handleImageUpload("shopFront", file)}
      />
      <CustomUploadImage
        name="Shop Counter View"
        image={imagePreviews.counterView}
        onChange={(file) => handleImageUpload("counterView", file)}
      />
      <CustomUploadImage
        name="Other Images (Optional)"
        image={imagePreviews.other}
        onChange={(file) => handleImageUpload("other", file)}
      />

      <h2 className="text-xl font-semibold mt-10 text-greens-900">
        QR Scanner for shop identity
      </h2>
      <QrCode />

      <button
        onClick={handleSubmit}
        className="mt-6 bg-greens-900 text-white px-4 py-2 rounded"
      >
        Upload & Continue
      </button>

      <Link
        href="/sign-in?auth=shopkepper"
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

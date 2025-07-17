"use client";
import { useState } from "react";
import CustomUploadImage from "./CustomUploadImage";
import QrCode from "./QrCode";
import Link from "next/link";
import Icon from "@/components/common/Icons";

const UploadShopImage = () => {
  const [imagePreviews, setImagePreviews] = useState({
    shopFront: null,
    counterView: null,
    other: null,
  });

  const handleImageUpload = (key, file) => {
    const previewURL = URL.createObjectURL(file);
    setImagePreviews((prev) => ({ ...prev, [key]: previewURL }));
  };
  return (
    <div>
      <h2 className="text-xl font-semibold pb-3.5 !leading-130 text-greens-900">
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
      <h2 className="text-xl font-semibold mt-10 !leading-130 text-greens-900">
        QR Scanner for shop identity
      </h2>
      <QrCode />
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

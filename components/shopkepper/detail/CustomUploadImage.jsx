import Icon from "@/components/common/Icons";
import React from "react";

const CustomUploadImage = ({ name, image, onChange }) => {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const isValid = ["image/jpeg", "image/png"].includes(file.type);
    if (!isValid) {
      alert("Only JPEG and PNG images are allowed.");
      return;
    }

    onChange(file);
  };

  return (
    <div className="h-[198px] py-3.5 mt-[18px] px-3 rounded-lg bg-greys-100 w-full">
      <h3 className="text-blacks-200 font-semibold text-base">{name}</h3>
      <label className="h-[130px] rounded-lg flex justify-center items-center border border-dashed border-black w-full mt-4 cursor-pointer overflow-hidden">
        <input
          type="file"
          accept="image/png, image/jpeg"
          onChange={handleFileChange}
          className="hidden"
        />
        {image ? (
          <img
            src={image}
            alt="Preview"
            className="max-h-full max-w-full object-contain"
          />
        ) : (
          <div className="flex flex-col items-center pointer-events-none">
            <Icon icon="imageUpload" />
            <p className="text-greys-dark-400 font-semibold text-sm mt-1">
              Select File
            </p>
            <p className="text-greys-dark-400 font-normal text-xs text-center max-w-[170px]">
              Supported formats: JPEG, PNG only
            </p>
          </div>
        )}
      </label>
    </div>
  );
};

export default CustomUploadImage;

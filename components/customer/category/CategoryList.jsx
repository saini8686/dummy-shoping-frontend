import Image from "next/image";
import React from "react";

const CategoryList = () => {
  return (
    <div className="mt-10 grid grid-cols-2">
      <div className="bg-white shadow-category rounded-lg">
        <Image
          src=""
          alt="category"
          width={143}
          height={111}
          sizes="100vw"
          className="w-[143px] h-[111px] object-contain"
        />
        <p className="text-sm font-medium text-blacks-200 !leading-130">
          Fruits & Vegetables
        </p>
      </div>
    </div>
  );
};

export default CategoryList;

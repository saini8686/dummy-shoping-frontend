import { CATEGORY_LIST } from "@/utils/helper";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const CategoryList = () => {
  return (
    <div className="mt-10 grid gap-x-3.5 gap-y-8 grid-cols-2">
      {CATEGORY_LIST.map((obj, i) => (
        <Link key={i} href={obj.path} className="bg-white flex justify-center items-center flex-col shadow-category rounded-lg">
          <Image
            src={obj.image}
            alt="category"
            width={143}
            height={111}
            sizes="100vw"
            className="w-[143px] h-[111px] object-contain"
          />
          <p className="text-sm font-medium pb-2.5 text-blacks-200 !leading-130">
            {obj.name}
          </p>
        </Link>
      ))}
    </div>
  );
};

export default CategoryList;

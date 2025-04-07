import { LIST_PRODUCT_FILTER } from "@/utils/helper";
import Link from "next/link";
import React from "react";

const ListPartProduct = () => {
  return (
    <div className="flex gap-2.5 mt-4 scroll-none flex-nowrap overflow-scroll">
      {LIST_PRODUCT_FILTER.map((obj, i) => (
        <Link
          href={obj.path}
          key={i}
          className="py-2 px-2.5 border hover:bg-greens-900 text-blacks-200 hover:text-white duration-300 border-greens-200 hover:border-transparent rounded"
        >
          <p className="text-sm font-normal capitalize text-center  !leading-130">
            {obj.name}
          </p>
        </Link>
      ))}
    </div>
  );
};

export default ListPartProduct;

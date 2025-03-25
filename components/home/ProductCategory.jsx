"use client";
import { useState } from "react";
import Icon from "../common/Icons";
import ProductCard from "../common/ProductCard";

const ProductCategory = ({ category, productList }) => {
  const [show, setShow] = useState(4);
  const showToggle = () => {
    setShow(show != 4 ? 4 : productList.length);
  };
  return (
    <>
      <div className="flex justify-between mt-8 mb-6">
        <h3 className="font-semibold line-clamp-1 text-black text-2xl max-w-[244px] !leading-[124%]">
          {category}
        </h3>
        <button
          onClick={() => showToggle()}
          className="flex text-nowrap items-center gap-2.5 text-base font-medium leading_100 text-reds-900"
        >
          See {show === 4 ? "All" : "Less"} <Icon icon="seeMore" />
        </button>
      </div>
      <div className="grid gap-y-6 gap-x-3 grid-cols-4">
        {productList.slice(0, show).map((obj, i) => (
          <ProductCard product={obj} key={i} />
        ))}
      </div>
    </>
  );
};

export default ProductCategory;

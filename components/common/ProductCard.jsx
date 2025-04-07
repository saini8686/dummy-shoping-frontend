import Image from "next/image";
import React from "react";

const ProductCard = ({ product }) => {
  return (
    <div className="max-w-[76px] mx-auto">
      <div className="bg-reds-200 w-[76px] max-w-[76px] flex justify-center items-center overflow-hidden rounded-xl min-w-[76px] h-[76px] max-h-[76px] min-h-[76px]">
        <Image
          src={product.image}
          width={63}
          height={63}
          sizes="100vw"
          className="w-[63px] h-[63px] object-cover"
          alt={`product-${product.name}`}
        />
      </div>
      <h2 className="text-xs text-center font-medium mt-2 !leading-[100%]">
        {product.name}
      </h2>
    </div>
  );
};

export default ProductCard;

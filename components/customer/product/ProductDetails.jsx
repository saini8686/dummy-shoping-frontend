"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { getAllProducts } from "../../../services/product.service";

const ProductDetails = ({shopId}) => {
  console.log(shopId, 'shopId in ProductDetails');
  
  const [products, setProduct] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllProducts()
      .then((res) => {
         const filtered = res.filter((product) => product.userId === Number(shopId));
        console.log(filtered);
        
        setProduct(filtered);
        
      })
      .catch((err) => console.error("Error fetching product:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading product...</p>;
  if (!products) return <p>Product not found.</p>;
  return (
    <div className="mt-7">
      {products.map((obj, i) => (
        <div className="flex justify-between items-center mt-3 pb-1 border-b border-white-100 ">
          <div className="flex items-center gap-1.5">
            <div className="border rounded-lg w-[60px] h-[60px] flex justify-center items-center border-white-100">
              <Image
                src={obj?.productImage}
                alt="list image"
                className="w-full h-full"
                width={60}
                height={60}
              />
            </div>
            <p>
              <span className="text-blacks-400 block text-base font-medium !leading-130">
                {obj.productName}
              </span>
              <span className="text-greys-1400 block text-sm font-normal !leading-130">
                {obj?.productPrize}
              </span>
            </p>
          </div>
          <p
            className={`py-1 px-2.5 text-sm text-[#324E32] font-semibold !leading-130 w-fit ${obj.inStock ? "bg-[#EAFFEA]" : "bg-[#E6E6E6]"
              }`}
          >
            {obj.inStock ? "In Stock" : "Out of Stock"}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ProductDetails;

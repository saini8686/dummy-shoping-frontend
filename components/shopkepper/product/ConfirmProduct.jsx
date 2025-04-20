"use client";
import { CustomButton } from "@/components/common/CustomButton";
import { useEffect, useState } from "react";
import ProductDeleteModal from "./modal/ProductDeleteModal";
import { useSearchParams } from "next/navigation";
import { getProductById } from "../../../services/product.service"

const ConfirmProduct = () => {
  const [deleteModal, setDeleteModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const searchParams = useSearchParams();
  const productId = searchParams.get("id");
  
  useEffect(() => {
    const fetchBasicDetails = async () => {
      try {
        const data = await getProductById(productId);
        console.log(data, 'basic details data');
        
        setProduct(data);
      } catch (error) {
        console.error('Error fetching basic details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBasicDetails();
  }, [productId]);

  useEffect(() => {
    deleteModal
      ? document.body.classList.add("overflow-hidden")
      : document.body.classList.remove("overflow-hidden");
  }, [deleteModal]);

  
  if (loading) return <p>Loading...</p>;

  return (
    <div className="">
      <div className="border mt-4 border-[#A9FBD3] rounded-lg h-[52px] p-4 w-full">
        <p className="text-sm font-normal !leading-130 text-black">
          {product?.productName || "Product Name"}
        </p>
      </div>
      <div className="border mt-4 border-[#A9FBD3] rounded-lg h-[52px] p-4 w-full">
        <p className="text-sm font-normal !leading-130 text-black">
          {product?.description || "Product Description"}
        </p>
      </div>
      <div className="border mt-4 border-[#A9FBD3] rounded-lg h-[52px] p-4 w-full">
        <p className="text-sm font-normal !leading-130 text-black">{product?.productCategory}</p>
      </div>
      <div className="border mt-4 border-[#A9FBD3] rounded-lg h-[52px] p-4 w-full">
        <p className="text-sm font-normal !leading-130 text-black">{product?.productUnit}</p>
      </div>
      <div className="border mt-4 border-[#A9FBD3] rounded-lg h-[52px] p-4 w-full">
        <p className="text-sm font-normal !leading-130 text-black">{product?.productPrize}</p>
      </div>
      <div className="mt-4 bg-greys-100 rounded-lg h-[52px] p-4 w-full">
        <p className="text-sm font-normal !leading-130 text-black">
          {product?.discountPrize}
        </p>
      </div>
      <div className="flex justify-between mt-6 items-center">
        <p>Mark Product in stock</p>
        <input
          type="checkbox"
          className="w-5 h-5 cursor-pointer accent-greens-900"
          id="inStock"
          value={product?.inStock}
        />
      </div>
      <CustomButton
        url="/shopkepper/product"
        customClass="w-full text-center mt-10"
      >
        Save Product
      </CustomButton>
      <button
        onClick={() => setDeleteModal(true)}
        className="transparent-green-border-button !border-reds-900 hover:!bg-reds-900 w-full !text-reds-900 !py-2.5 !font-medium hover:!text-white !mt-4"
      >
        Delete Product
      </button>
      {deleteModal && <ProductDeleteModal />}
    </div>
  );
};

export default ConfirmProduct;

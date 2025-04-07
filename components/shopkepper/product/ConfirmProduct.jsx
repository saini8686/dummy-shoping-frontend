"use client";
import { CustomButton } from "@/components/common/CustomButton";
import { useEffect, useState } from "react";
import ProductDeleteModal from "./modal/ProductDeleteModal";

const ConfirmProduct = () => {
  const [deleteModal, setDeleteModal] = useState(false);
  useEffect(() => {
    deleteModal
      ? document.body.classList.add("overflow-hidden")
      : document.body.classList.remove("overflow-hidden");
  }, [deleteModal]);

  return (
    <div className="">
      <div className="border mt-4 border-[#A9FBD3] rounded-lg h-[52px] p-4 w-full">
        <p className="text-sm font-normal !leading-130 text-black">
          Mama Gold Premium Rice
        </p>
      </div>
      <div className="border mt-4 border-[#A9FBD3] rounded-lg h-[52px] p-4 w-full">
        <p className="text-sm font-normal !leading-130 text-black">
          From Thailand. Pure refined Rice
        </p>
      </div>
      <div className="border mt-4 border-[#A9FBD3] rounded-lg h-[52px] p-4 w-full">
        <p className="text-sm font-normal !leading-130 text-black">Grains</p>
      </div>
      <div className="border mt-4 border-[#A9FBD3] rounded-lg h-[52px] p-4 w-full">
        <p className="text-sm font-normal !leading-130 text-black">Kilogram</p>
      </div>
      <div className="border mt-4 border-[#A9FBD3] rounded-lg h-[52px] p-4 w-full">
        <p className="text-sm font-normal !leading-130 text-black">45,000</p>
      </div>
      <div className="mt-4 bg-greys-100 rounded-lg h-[52px] p-4 w-full">
        <p className="text-sm font-normal !leading-130 text-black">
          Discount Price (Optional)
        </p>
      </div>
      <div className="flex justify-between mt-6 items-center">
        <p>Mark Product in stock</p>
        <input
          type="checkbox"
          className="w-5 h-5 cursor-pointer accent-greens-900"
          id="inStock"
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

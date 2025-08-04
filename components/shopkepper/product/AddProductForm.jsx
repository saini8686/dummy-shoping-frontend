"use client";
import { CustomInput } from "@/components/auth/common/CustomInput";
import { CustomButton } from "@/components/common/CustomButton";
import { useEffect, useState } from "react";
import CustomUploadImage from "../detail/CustomUploadImage";
import { useRouter, useSearchParams } from "next/navigation";
import ProductAddedModal from "./modal/ProductAddedModal";
import ConfirmProduct from "./ConfirmProduct";
import { createProduct } from "../../../services/product.service";
import Cookies from "js-cookie";

const AddProductForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  let product = searchParams.get("product");

  const [formDetails, setFormDetails] = useState({
    productName: "",
    description: "",
    productImage: "", // base64 string
    inStock: false,
    discountPrize: "",
    productCategory: "",
    productUnit: "",
    productPrize: "",
  });

  const [error, setError] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [productDetails, setProduct] = useState(false);

  const handleImageUpload = async (key, file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormDetails((prev) => ({
        ...prev,
        [key]: reader.result, // base64 string
      }));
    };
    if (file) reader.readAsDataURL(file);
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const isFieldEmpty = (value) => {
      if (typeof value === "string") return value.trim() === "";
      if (Array.isArray(value)) return value.length === 0;
      if (value === null || value === undefined) return true;
      return false;
    };

    const isAnyFieldEmpty = Object.values(formDetails).some(isFieldEmpty);
    if (!isAnyFieldEmpty) {
      try {
        setError(false);
        const userId = Cookies.get("userId");

        const payload = {
          ...formDetails,
          userId,
        };

        const res = await createProduct(payload);
        console.log("Product Created:", res);
        setProduct(res);

        // Reset form
        setFormDetails({
          productName: "",
          description: "",
          productImage: "",
          inStock: false,
          discountPrize: "",
          productCategory: "",
          productUnit: "",
          productPrize: "",
        });

        setConfirm(true);
      } catch (error) {
        console.error("Error creating product:", error);
        setError(true);
        setConfirm(false);
      }
    } else {
      setError(true);
      setConfirm(false);
    }
  };

  const closeConfirm = () => {
    setConfirm(false);
  };

  const showProductDetail = () => {
    router.push(`/shopkepper/product/add-product?product=confirm&id=${productDetails?.product?.id}`);
    setConfirm(false);
  };

  useEffect(() => {
    confirm
      ? document.body.classList.add("overflow-hidden")
      : document.body.classList.remove("overflow-hidden");
  }, [confirm]);

  return (
    <>
      {product === "confirm" ? (
        <ConfirmProduct />
      ) : (
        <form onSubmit={submitHandler}>
          <div className="space-y-4">
            <CustomInput
              placeholder="Product Name"
              name="productName"
              type="text"
              error={!formDetails.productName && error}
              errorText="Product name is required"
              value={formDetails.productName}
              onChange={(e) =>
                setFormDetails({
                  ...formDetails,
                  productName: e.target.value,
                })
              }
            />
            <CustomInput
              placeholder="Describe the Product"
              name="description"
              type="text"
              error={!formDetails.description && error}
              errorText="Description is required"
              value={formDetails.description}
              onChange={(e) =>
                setFormDetails({
                  ...formDetails,
                  description: e.target.value,
                })
              }
            />
            <CustomUploadImage
              image={formDetails.productImage}
              onChange={(file) => handleImageUpload("productImage", file)}
            />
            <CustomInput
              placeholder="Product Category"
              name="productCategory"
              type="text"
              error={!formDetails.productCategory && error}
              errorText="Product category is required"
              value={formDetails.productCategory}
              onChange={(e) =>
                setFormDetails({
                  ...formDetails,
                  productCategory: e.target.value,
                })
              }
            />
            <CustomInput
              placeholder="Product Unit"
              name="productUnit"
              type="number"
              error={!formDetails.productUnit && error}
              errorText="Product unit is required"
              value={formDetails.productUnit}
              onChange={(e) =>
                setFormDetails({
                  ...formDetails,
                  productUnit: e.target.value,
                })
              }
            />
            <CustomInput
              placeholder="Product Price"
              name="productPrize"
              type="number"
              error={!formDetails.productPrize && error}
              errorText="Product price is required"
              value={formDetails.productPrize}
              onChange={(e) =>
                setFormDetails({
                  ...formDetails,
                  productPrize: e.target.value,
                })
              }
            />
            <CustomInput
              placeholder="Discount Price"
              name="discountPrize"
              type="number"
              error={!formDetails.discountPrize && error}
              errorText="Discount price is required"
              value={formDetails.discountPrize}
              onChange={(e) =>
                setFormDetails({
                  ...formDetails,
                  discountPrize: e.target.value,
                })
              }
            />
            <div className="flex justify-between items-center">
              <p>Mark Product in Stock</p>
              <input
                type="checkbox"
                className="w-5 h-5 cursor-pointer accent-greens-900"
                id="inStock"
                name="inStock"
                checked={formDetails.inStock}
                onChange={(e) =>
                  setFormDetails({
                    ...formDetails,
                    inStock: e.target.checked,
                  })
                }
              />
            </div>
            {/* <CustomButton isSubmit customClass="w-full">
              Add Product
            </CustomButton> */}
            <button
              type="submit"
              className={`bg-green-600 text-white p-2 rounded`}
            >
              Add Product
            </button>
            {confirm && (
              <ProductAddedModal
                showProductDetail={showProductDetail}
                closeConfirm={closeConfirm}
              />
            )}
          </div>
        </form>
      )}
    </>
  );
};

export default AddProductForm;

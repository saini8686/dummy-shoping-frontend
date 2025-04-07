"use client";
import { CustomInput } from "@/components/auth/common/CustomInput";
import { useState } from "react";
import CustomUploadImage from "../detail/CustomUploadImage";

const AddProductForm = () => {
  const [formDetails, setFormDetails] = useState({
    productName: "",
    village: "",
    description: "",
    district: "",
    productImage: null,
    state: "",
    shopName: "",
    productCategory: "",
    gstNumber: "",
    number: "",
    inStock: false,
    address: "",
  });
  const handleImageUpload = (key, file) => {
    const previewURL = URL.createObjectURL(file);
    setFormDetails((prev) => ({ ...prev, [key]: previewURL }));
  };
  const [error, setError] = useState(false);
  return (
    <form>
      <div className="space-y-4">
        <CustomInput
          placeholder="Product Name"
          name="productName"
          type="text"
          error={!formDetails.productName && error}
          errorText="Product name Is Required"
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
          errorText="Description Is Required"
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
          errorText="Product Category Is Required"
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
          type="text"
          error={!formDetails.productUnit && error}
          errorText="Product Unit Is Required"
          value={formDetails.productUnit}
          onChange={(e) =>
            setFormDetails({
              ...formDetails,
              productUnit: e.target.value,
            })
          }
        />
        <CustomInput
          placeholder="Product Price (N)"
          name="productPrize"
          type="number"
          error={!formDetails.productPrize && error}
          errorText="Product Price Is Required"
          value={formDetails.productPrize}
          onChange={(e) =>
            setFormDetails({
              ...formDetails,
              productPrize: e.target.value,
            })
          }
        />
        <CustomInput
          placeholder="Discount Price (N)"
          name="discountPrize"
          type="number"
          error={!formDetails.discountPrize && error}
          errorText="Discount Price Is Required"
          value={formDetails.discountPrize}
          onChange={(e) =>
            setFormDetails({
              ...formDetails,
              discountPrize: e.target.value,
            })
          }
        />
        <div className="flex justify-between items-center">
          <p>Mark Product in stock</p>
          <input
            type="checkbox"
            className="w-5 h-5 cursor-pointer accent-greens-900"
            id="inStock"
            value={formDetails.inStock}
            onChange={(e) =>
              setFormDetails({
                ...formDetails,
                inStock: e.target.value,
              })
            }
          />
        </div>
      </div>
    </form>
  );
};

export default AddProductForm;

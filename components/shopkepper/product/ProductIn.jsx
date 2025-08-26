"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { getAllProducts, updateProduct, deleteProduct } from "../../../services/product.service";
import Cookies from "js-cookie";
import { Pencil, Trash2 } from "lucide-react";
import CustomUploadImage from "../detail/CustomUploadImage";

const ProductIn = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editProduct, setEditProduct] = useState(null);
  const [formDetails, setFormDetails] = useState({});

  useEffect(() => {
    const userId = Cookies.get("userId");

    getAllProducts()
      .then((res) => {
        const filtered = res.filter((product) => product.userId === Number(userId));
        setProducts(filtered);
      })
      .catch((err) => console.error("Error fetching product:", err))
      .finally(() => setLoading(false));
  }, []);

  const openEditModal = (product) => {
    setEditProduct(product);
    setFormDetails({
      productName: product.productName || "",
      description: product.description || "",
      productImage: product.productImage || "",
      productCategory: product.productCategory || "",
      productUnit: product.productUnit || "",
      productPrize: product.productPrize || "",
      discountPrize: product.discountPrize || "",
      inStock: product.inStock || false,
    });
  };

  const closeEditModal = () => {
    setEditProduct(null);
    setFormDetails({});
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormDetails({
      ...formDetails,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleImageUpload = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormDetails((prev) => ({
        ...prev,
        productImage: reader.result,
      }));
    };
    if (file) reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!editProduct) return;

    try {
      const updatedProduct = { ...editProduct, ...formDetails };
      await updateProduct(editProduct.id, updatedProduct);

      setProducts((prev) =>
        prev.map((p) => (p.id === editProduct.id ? updatedProduct : p))
      );
      closeEditModal();
    } catch (err) {
      console.error("Error updating product:", err);
    }
  };

  const handleDelete = async (productId) => {
    const confirmDelete = confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return;

    try {
      await deleteProduct(productId);
      setProducts((prev) => prev.filter((p) => p.id !== productId));
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  if (loading) return <p>Loading products...</p>;
  if (!products || products.length === 0) return <p>No products found.</p>;

  return (
    <div className="mt-7">
      {products.map((obj, i) => (
        <div
          key={obj.id || obj._id || i}
          className="flex justify-between items-center mt-3 pb-1 border-b border-white-100"
        >
          <div className="flex items-center gap-1.5">
            <div className="border rounded-lg w-[60px] h-[60px] flex justify-center items-center border-white-100">
              <Image
                src={obj?.productImage}
                alt="product"
                width={60}
                height={60}
                className="w-full h-full"
              />
            </div>
            <p>
              <span className="text-blacks-400 block text-base font-medium !leading-130">
                {obj.productName}
              </span>
              <span className="text-greys-1400 block text-sm font-normal !leading-130">
                {obj.productPrize}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Pencil
              className="w-6 h-6 text-[#01BA5D] cursor-pointer"
              onClick={() => openEditModal(obj)}
            />
            <Trash2
              className="w-6 h-6 text-red-600 cursor-pointer"
              onClick={() => handleDelete(obj.id)}
            />
            <p
              className={`py-1 px-2.5 text-sm text-[#324E32] font-semibold !leading-130 w-fit ${
                obj.inStock ? "bg-[#EAFFEA]" : "bg-[#E6E6E6]"
              }`}
            >
              {obj.inStock ? "In Stock" : "Out of Stock"}
            </p>
          </div>
        </div>
      ))}

      {/* Edit Modal */}
      {editProduct && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-lg w-[400px] overflow-y-auto max-h-[90vh]">
            <h2 className="text-xl font-semibold mb-4">Edit Product</h2>

            <label className="block mb-2">
              Name:
              <input
                type="text"
                name="productName"
                value={formDetails.productName}
                onChange={handleChange}
                className="w-full border px-2 py-1 rounded mt-1"
              />
            </label>

            <label className="block mb-2">
              Description:
              <textarea
                name="description"
                value={formDetails.description}
                onChange={handleChange}
                className="w-full border px-2 py-1 rounded mt-1"
              />
            </label>

            <label className="block mb-2">
              Product Image:
              <CustomUploadImage
                image={formDetails.productImage}
                onChange={handleImageUpload}
              />
            </label>

            <label className="block mb-2">
              Category:
              <input
                type="text"
                name="productCategory"
                value={formDetails.productCategory}
                onChange={handleChange}
                className="w-full border px-2 py-1 rounded mt-1"
              />
            </label>

            <label className="block mb-2">
              Unit:
              <input
                type="number"
                name="productUnit"
                value={formDetails.productUnit}
                onChange={handleChange}
                className="w-full border px-2 py-1 rounded mt-1"
              />
            </label>

            <label className="block mb-2">
              Price:
              <input
                type="number"
                name="productPrize"
                value={formDetails.productPrize}
                onChange={handleChange}
                className="w-full border px-2 py-1 rounded mt-1"
              />
            </label>

            <label className="block mb-2">
              Discount Price:
              <input
                type="number"
                name="discountPrize"
                value={formDetails.discountPrize}
                onChange={handleChange}
                className="w-full border px-2 py-1 rounded mt-1"
              />
            </label>

            <label className="flex items-center mb-4">
              <span>In Stock:</span>
              <input
                type="checkbox"
                name="inStock"
                checked={formDetails.inStock}
                onChange={handleChange}
                className="ml-2 w-5 h-5 accent-greens-900"
              />
            </label>

            <div className="flex justify-end gap-2">
              <button
                onClick={closeEditModal}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-500 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductIn;

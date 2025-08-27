"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { getAllProducts, updateProduct, deleteProduct } from "../../../services/product.service";
import Cookies from "js-cookie";
import { Pencil, Trash2, Plus } from "lucide-react";
import CustomUploadImage from "../detail/CustomUploadImage";

const ProductIn = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editProduct, setEditProduct] = useState(null);
  const [formDetails, setFormDetails] = useState({});
  const [showAddNew, setShowAddNew] = useState(false);

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
    setShowAddNew(false);
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
    if (!editProduct && !showAddNew) return;

    try {
      const updatedProduct = editProduct
        ? { ...editProduct, ...formDetails }
        : { ...formDetails, userId: Number(Cookies.get("userId")) };

      if (editProduct) {
        await updateProduct(editProduct.id, updatedProduct);
        setProducts((prev) =>
          prev.map((p) => (p.id === editProduct.id ? updatedProduct : p))
        );
      } else {
        // For add new, just push locally (API call can be added)
        setProducts((prev) => [...prev, { ...updatedProduct, id: Date.now() }]);
      }

      closeEditModal();
    } catch (err) {
      console.error("Error saving product:", err);
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

  if (loading) return <p className="text-center py-10">Loading products...</p>;
  if (!products || products.length === 0)
    return <p className="text-center py-10">No products found.</p>;

  return (
    <div className="mt-7">
      {/* Title & Add New Button */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">My Products</h2>
        {/* <button
          onClick={() => setShowAddNew(true)}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add New Product
        </button> */}
      </div>

      {/* Product List */}
      <div className="space-y-4">
        {products.map((obj) => (
          <div
            key={obj.id || obj._id}
            className="bg-white rounded-lg shadow-md p-4 flex gap-4 hover:shadow-lg transition-shadow duration-300"
          >
            {/* Product Image */}
            <div className="flex-shrink-0 w-24 h-24 border rounded-lg overflow-hidden">
              <img
                src={obj.productImage || "/placeholder.png"}
                alt={obj.productName}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Product Details */}
            <div className="flex-1 flex flex-col justify-between">
              <div className="flex flex-col gap-1">
                <h3 className="text-lg font-semibold text-gray-800">{obj.productName}</h3>
                <p className="text-sm text-gray-500">
                  <span className="font-medium">Category:</span> {obj.productCategory || "-"}
                </p>
                <p className="text-sm text-gray-700 flex items-center gap-2">
                  <span className="font-medium">Price:</span> ₹{obj.productPrize}
                  {obj.discountPrize && (
                    <span className="text-gray-400 line-through ml-2">
                      ₹{obj.discountPrize}
                    </span>
                  )}
                </p>
                {obj.description && (
                  <p className="text-xs text-gray-500 truncate max-w-[300px]">
                    <span className="font-medium">Description:</span> {obj.description}
                  </p>
                )}
              </div>

              {/* Stock & Actions */}
              <div className="flex justify-between items-center mt-3">
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold ${obj.inStock ? "bg-green-100 text-green-800" : "bg-gray-200 text-gray-600"
                    }`}
                >
                  {obj.inStock ? "In Stock" : "Out of Stock"}
                </span>

                <div className="flex gap-2">
                  <button
                    onClick={() => openEditModal(obj)}
                    className="px-3 py-1 text-green-600 border border-green-600 rounded hover:bg-green-50 transition-colors duration-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(obj.id)}
                    className="px-3 py-1 text-red-600 border border-red-600 rounded hover:bg-red-50 transition-colors duration-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>


      {/* Edit / Add Modal */}
      {(editProduct || showAddNew) && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md overflow-y-auto max-h-[90vh] shadow-lg">
            <h2 className="text-xl font-semibold mb-4">
              {showAddNew ? "Add New Product" : "Edit Product"}
            </h2>

            <label className="block mb-3">
              <span className="font-medium text-gray-700">Name:</span>
              <input
                type="text"
                name="productName"
                value={formDetails.productName}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </label>

            <label className="block mb-3">
              <span className="font-medium text-gray-700">Description:</span>
              <textarea
                name="description"
                value={formDetails.description}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </label>

            <label className="block mb-3">
              <span className="font-medium text-gray-700">Product Image:</span>
              <CustomUploadImage
                image={formDetails.productImage}
                onChange={handleImageUpload}
              />
            </label>

            <label className="block mb-3">
              <span className="font-medium text-gray-700">Category:</span>
              <input
                type="text"
                name="productCategory"
                value={formDetails.productCategory}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </label>

            <label className="block mb-3">
              <span className="font-medium text-gray-700">Unit:</span>
              <input
                type="number"
                name="productUnit"
                value={formDetails.productUnit}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </label>

            <label className="block mb-3">
              <span className="font-medium text-gray-700">Price:</span>
              <input
                type="number"
                name="productPrize"
                value={formDetails.productPrize}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </label>

            <label className="block mb-3">
              <span className="font-medium text-gray-700">Discount Price:</span>
              <input
                type="number"
                name="discountPrize"
                value={formDetails.discountPrize}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </label>

            <label className="flex items-center mb-4 gap-2">
              <input
                type="checkbox"
                name="inStock"
                checked={formDetails.inStock}
                onChange={handleChange}
                className="w-5 h-5 accent-green-600"
              />
              <span className="font-medium text-gray-700">In Stock</span>
            </label>

            <div className="flex justify-end gap-3">
              <button
                onClick={closeEditModal}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
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

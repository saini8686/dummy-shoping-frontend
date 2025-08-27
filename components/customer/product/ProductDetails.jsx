"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { getAllProducts } from "../../../services/product.service";
import { createPayment } from "../../../services/payment.service";
import { getUser } from "@/services/users.service"; // ✅ added
import Cookies from "js-cookie";
import { CustomButton } from "@/components/common/CustomButton";
import { Dialog } from "@headlessui/react";
import { toast } from "react-toastify"; // ✅ added for feedback

const ProductDetails = ({ shopId }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState(0);
  const [rating, setRating] = useState(0);

  const userId = Cookies.get("userId");
  const token = Cookies.get("token"); // ✅ added

  // ✅ Load products for this shop
  useEffect(() => {
    getAllProducts()
      .then((res) => {
        const filtered = res.filter(
          (product) => String(product.userId) === String(shopId)
        );
        setProducts(filtered);
      })
      .catch((err) => console.error("Error fetching product:", err))
      .finally(() => setLoading(false));
  }, [shopId]);

  // ✅ Add to cart
  const handleAddToCart = (product) => {
    setCart((prevCart) => {
      const exists = prevCart.find((item) => item.id === product.id);
      if (exists) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      } else {
        return [...prevCart, { ...product, qty: 1 }];
      }
    });
  };

  // ✅ Remove from cart
  const handleRemoveFromCart = (productId) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.id === productId ? { ...item, qty: item.qty - 1 } : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  // ✅ Confirm & Pay
  const handleSubmitPayment = async () => {
    try {
      if (!userId || !token) {
        toast.error("You must be logged in to make a payment.");
        return;
      }
      if (rating < 1) {
        toast.error("Please rate this shop before paying.");
        return;
      }

      const userInfo = await getUser(userId, token);
      const value = parseFloat(amount);

      const data = {
        userId,
        userName: userInfo?.name || "User",
        earnAmount: 0,
        totalAmount: value,
        paymentMethod: "online",
        transactionId: shopId, // ✅ use shopId as transactionId
        rating,
        status: "pending",
        filepath: "",
        mimetype: "shop-payment",
        shopId,
        shopName: `Shop #${shopId}`,
      };

      await createPayment(data, token);

      toast.success(`Payment successful ₹${value}`);
      setIsOpen(false);
      setCart([]);
      setAmount(0);
      setRating(0);
    } catch (error) {
      console.error("Payment failed:", error);
      toast.error("Payment failed. Try again.");
    }
  };

  if (loading) return <p>Loading product...</p>;
  if (!products.length) return <p>No products found.</p>;

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.productPrize * item.qty,
    0
  );

  return (
    <div className="mt-7">
      {/* ✅ Product List */}
      {products.map((obj) => {
        const inCart = cart.find((item) => item.id === obj.id);
        return (
          <div
            key={obj.id}
            className="flex justify-between items-center mt-3 pb-1 border-b border-white-100"
          >
            <div className="flex items-center gap-1.5">
              <div className="border rounded-lg w-[60px] h-[60px] flex justify-center items-center border-white-100">
                <Image
                  src={obj?.productImage}
                  alt="product"
                  className="w-full h-full object-cover"
                  width={60}
                  height={60}
                />
              </div>
              <p>
                <span className="text-blacks-400 block text-base font-medium">
                  {obj.productName}
                </span>
                <span className="text-greys-1400 block text-sm font-normal">
                  ₹{obj?.productPrize}
                </span>
              </p>
            </div>

            <div className="flex items-center gap-2">
              {inCart ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleRemoveFromCart(obj.id)}
                    className="px-2 py-1 bg-red-500 text-white rounded-lg"
                  >
                    -
                  </button>
                  <span>{inCart.qty}</span>
                  <button
                    onClick={() => handleAddToCart(obj)}
                    className="px-2 py-1 bg-green-500 text-white rounded-lg"
                  >
                    +
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleAddToCart(obj)}
                  className="px-3 py-1 bg-blue-500 text-white rounded-lg"
                >
                  Add to Cart
                </button>
              )}
            </div>
          </div>
        );
      })}

      {/* ✅ Cart + Checkout */}
      {cart.length > 0 && (
        <div className="mt-6 p-3 border rounded-lg bg-gray-50">
          <h3 className="font-bold mb-2">🛒 Cart</h3>
          {cart.map((item) => (
            <p key={item.id}>
              {item.productName} x {item.qty} (₹{item.productPrize * item.qty})
            </p>
          ))}
          <p className="mt-2 font-semibold">Total: ₹{cartTotal}</p>

          <CustomButton
            customClass="px-4 py-2 bg-green-600 text-white rounded-lg w-full mt-3"
            onClick={() => {
              setAmount(cartTotal);
              setIsOpen(true);
            }}
          >
            Checkout
          </CustomButton>
        </div>
      )}

      {/* ✅ Payment Dialog */}
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md bg-white rounded-lg p-6 shadow-lg">
            <Dialog.Title className="text-lg font-semibold text-gray-800 mb-4">
              Confirm Payment
            </Dialog.Title>

            <p className="mb-2">You are about to pay for:</p>
            {cart.map((item) => (
              <p key={item.id}>
                {item.productName} x {item.qty} = ₹{item.productPrize * item.qty}
              </p>
            ))}

            <p className="mt-3 font-bold">Total: ₹{amount}</p>

            {/* ⭐ Rating */}
            <div className="flex items-center mt-4 mb-4">
              <span className="mr-2 text-gray-700">Rate this shop:</span>
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => setRating(star)}
                  className={`text-2xl cursor-pointer ${
                    star <= rating ? "text-yellow-400" : "text-gray-300"
                  }`}
                >
                  ★
                </span>
              ))}
            </div>

            <div className="flex justify-end gap-2">
              <CustomButton
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 rounded-md !bg-gray-200 !text-black"
              >
                Cancel
              </CustomButton>
              <CustomButton
                onClick={handleSubmitPayment}
                className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white"
              >
                Pay
              </CustomButton>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default ProductDetails;

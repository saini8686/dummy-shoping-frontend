"use client";

import BottomBar from "@/components/common/BottomBar";
import HeaderCustomer from "@/components/customer/HeaderCustomer";
import React, { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { useParams } from "next/navigation";
import Cookies from "js-cookie";
import { getBasicDetails } from "@/services/basic-details.service";
import { createPayment } from "@/services/payment.service";
import { getUser, updateUser } from "@/services/users.service";
import { CustomButton } from "@/components/common/CustomButton";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProductDetails from "@/components/customer/product/ProductDetails";
// import Image from "next/image"; // Optional: if you switch to next/image

const Page = () => {
  const params = useParams();
  const shopId = params.userId;
  const userId = Cookies.get("userId");
  const token = Cookies.get("token");

  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [rating, setRating] = useState(0);
  const [shopUserData, setShopUserData] = useState(null);
  const [shopDetails, setShopDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDetails = async () => {
    try {
      const shopUserData = await getUser(shopId, token);
      setShopUserData(shopUserData);

      const shopData = await getBasicDetails(shopId);
      setShopDetails(shopData || null);
    } catch (error) {
      toast.error("Failed to fetch data.");
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (shopId && userId && token) fetchDetails();
  }, [shopId]);

  const handleSubmit = async () => {
    const value = parseFloat(amount);

    if (isNaN(value)) {
      toast.error("Please enter a valid number.");
      return;
    }

    if (value <= 0) {
      toast.error("Amount must be greater than zero.");
      return;
    }

    if (!rating || rating < 1 || rating > 5) {
      toast.error("Please select a rating (1–5 stars).");
      return;
    }

    if (!token || !userId || !shopId) {
      toast.error("Missing required details.");
      return;
    }

    try {
      const userInfo = await getUser(userId, token);

      const data = {
        userId: userId,
        userName: userInfo?.name || "User",
        earnAmount: 0,
        totalAmount: value,
        paymentMethod: "online",
        transactionId: shopId,
        rating: rating || 0,
        status: "pending",
        filepath: ""
      };

      await createPayment(data, token);

      const userData = {
        ...userInfo,
        review: (
          (userInfo.review * userInfo.reviewCount + rating) /
          (userInfo.reviewCount + 1)
        ),
        reviewCount: userInfo.reviewCount + 1,
      }
      await updateUser(userData);

      toast.success(`Payment successful ₹${value}`);
      setIsOpen(false);
      setAmount("");
      setRating(0);
    } catch (error) {
      console.error("Payment failed:", error);
      toast.error("Payment failed. Please try again.");
    }
  };

  return (
    <div className="bg-white-low">
      <ToastContainer />
      <HeaderCustomer name="Shop Details" />

      <div className="px-4 pb-20 pt-8">
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : !shopDetails ? (
          <p className="text-red-500">No shop data found for this user.</p>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200 space-y-3 text-sm">
            {/* Shop Images */}
            <h2 className="text-xl font-semibold mb-4 uppercase text-center">
              <span className="text-green-600">{shopDetails.shopname}</span></h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
              {shopUserData.shop_front_url && (
                <ImageCard
                  label="Shop Front"
                  url={`${process.env.NEXT_PUBLIC_API_BASE?.replace(/\/$/, "")}/${shopUserData.shop_front_url?.replace(/^\//, "")}`}
                />
              )}
              {shopUserData.shop_counter_url && (
                <ImageCard
                  label="Counter View"
                  url={`${process.env.NEXT_PUBLIC_API_BASE?.replace(/\/$/, "")}/${shopUserData.shop_counter_url?.replace(/^\//, "")}`}
                />
              )}
              {shopUserData.other_img_url && (
                <ImageCard
                  label="Other View"
                  url={`${process.env.NEXT_PUBLIC_API_BASE?.replace(/\/$/, "")}/${shopUserData.other_img_url?.replace(/^\//, "")}`}
                />
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded shadow border border-gray-200 p-4 mt-4">
              <Detail label="Username" value={shopDetails.username} />
              <Detail label="Category" value={shopDetails.category} />
              <Detail label="GST Number" value={shopDetails.gst_number} />
              <Detail label="Address" value={`${shopDetails.village}, ${shopDetails.city}, ${shopDetails.district}, ${shopDetails.state}`} />
            </div>

            <h2 className="text-xl mt-2 capitalize font-semibold font-roboto !leading-130">
              Listed Products
            </h2>

            <ProductDetails shopId={shopId} />

            <CustomButton
              url="#"
              customClass="mt-4 w-fit text-sm w-full text-center"
              onClick={(e) => {
                e.preventDefault();
                setIsOpen(true);
              }}
            >
              Pay
            </CustomButton>
          </div>
        )}
      </div>

      {/* Popup Dialog */}
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md bg-white rounded-lg p-6 shadow-lg">
            <Dialog.Title className="text-lg font-semibold text-gray-800 mb-4">
              Enter Payment Amount
            </Dialog.Title>

            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-2 border rounded-md mb-4 focus:outline-none focus:ring focus:border-blue-300"
            />

            <div className="flex items-center mb-4">
              <span className="mr-2 text-gray-700">Rate this shop:</span>
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => setRating(star)}
                  className={`text-2xl cursor-pointer transition ${star <= rating ? "text-yellow-400" : "text-gray-300"
                    }`}
                >
                  ★
                </span>
              ))}
            </div>

            <div className="flex justify-end gap-2">
              <CustomButton
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 rounded-md !bg-transparent !text-[#01be62] hover:!bg-gray-100"
              >
                Cancel
              </CustomButton>
              <CustomButton
                onClick={handleSubmit}
                className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white"
              >
                Submit
              </CustomButton>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      <BottomBar />
    </div>
  );
};

const Detail = ({ label, value, full = false }) => (
  <div className={full ? "col-span-full" : ""}>
    <p className="text-gray-600">
      <span className="font-medium text-gray-800">{label}:</span>{" "}
      {value || <span className="text-gray-400 italic">N/A</span>}
    </p>
  </div>
);

const ImageCard = ({ label, url }) => (
  <div className="border rounded-md overflow-hidden shadow-sm">
    {/* Uncomment below and configure next.config.js if using next/image */}
    {/* <Image src={url} alt={label} width={400} height={200} className="w-full h-40 object-cover" /> */}
    <img src={url} alt={label} className="w-full h-40 object-cover" />
    <div className="p-2 text-sm text-center text-gray-700 font-medium">{label}</div>
  </div>
);

export default Page;

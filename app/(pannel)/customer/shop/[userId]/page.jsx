"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Cookies from "js-cookie";
import { Dialog } from "@headlessui/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import HeaderCustomer from "@/components/customer/HeaderCustomer";
import BottomBar from "@/components/common/BottomBar";
import { CustomButton } from "@/components/common/CustomButton";
import ProductDetails from "@/components/customer/product/ProductDetails";

import { getBasicDetails } from "@/services/basic-details.service";
import { getUser, updateUser } from "@/services/users.service";
import { createPayment } from "@/services/payment.service";

const Page = () => {
  const { userId: shopId } = useParams();
  const userId = Cookies.get("userId");
  const token = Cookies.get("token");

  const [isOpen, setIsOpen] = useState(false); // payment modal
  const [viewerOpen, setViewerOpen] = useState(false); // image viewer modal
  const [viewerImg, setViewerImg] = useState(null);

  const [amount, setAmount] = useState("");
  const [rating, setRating] = useState(0);
  const [shopUserData, setShopUserData] = useState(null);
  const [shopDetails, setShopDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const [shopUser, shopData] = await Promise.all([
          getUser(shopId, token),
          getBasicDetails(shopId),
        ]);
        setShopUserData(shopUser);
        setShopDetails(shopData || null);
      } catch (error) {
        toast.error("Failed to fetch shop data.");
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (shopId && userId && token) fetchDetails();
  }, [shopId, userId, token]);

  const handleSubmit = async () => {
    const value = parseFloat(amount);

    if (isNaN(value) || value <= 0)
      return toast.error("Enter a valid amount.");
    if (!rating || rating < 1 || rating > 5)
      return toast.error("Rate this shop (1–5 stars).");

    try {
      const userInfo = await getUser(userId, token);

      const data = {
        userId,
        userName: userInfo?.name || "User",
        earnAmount: 0,
        totalAmount: value,
        paymentMethod: "online",
        transactionId: shopId,
        rating,
        status: "pending",
        filepath: "",
        mimetype: shopDetails?.shopname,
        shopId,
        shopName: shopDetails?.shopname,
      };

      await createPayment(data, token);

      const reviewTotal =
        (shopUserData.review || 0) * (shopUserData.reviewCount || 0);
      const updatedUser = {
        ...shopUserData,
        review:
          (reviewTotal + rating) /
          ((shopUserData.reviewCount || 0) + 1),
        reviewCount: (shopUserData.reviewCount || 0) + 1,
      };

      await updateUser(updatedUser);

      toast.success(`Payment successful ${value}`);
      setIsOpen(false);
      setAmount("");
      setRating(0);
    } catch (error) {
      console.error("Payment failed:", error);
      toast.error("Payment failed. Try again.");
    }
  };

  return (
    <div className="bg-white-low">
      <ToastContainer />
      <HeaderCustomer name="Shop Details" />

      <div className="px-4 pb-20 pt-8">
        {loading ? (
          <div className="text-center text-gray-500 py-12 text-sm animate-pulse">
            Loading shop details...
          </div>
        ) : !shopDetails ? (
          <p className="text-red-500">No shop data found for this user.</p>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200 space-y-3 text-sm">
            <CustomButton
              customClass="mt-4 w-full text-sm text-center"
              onClick={() => setIsOpen(true)}
            >
              Pay
            </CustomButton>

            {/* --- Shop Images --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
              {shopUserData?.shop_front_url && (
                <ImageCard
                  label="Shop Front"
                  url={`${process.env.NEXT_PUBLIC_API_BASE?.replace(
                    /\/$/,
                    ""
                  )}/${shopUserData.shop_front_url?.replace(/^\//, "")}`}
                  onClick={() =>
                    setViewerImg({
                      label: "Shop Front",
                      url: `${process.env.NEXT_PUBLIC_API_BASE?.replace(
                        /\/$/,
                        ""
                      )}/${shopUserData.shop_front_url?.replace(/^\//, "")}`,
                    })
                  }
                />
              )}
              {shopUserData?.shop_counter_url && (
                <ImageCard
                  label="Counter View"
                  url={`${process.env.NEXT_PUBLIC_API_BASE?.replace(
                    /\/$/,
                    ""
                  )}/${shopUserData.shop_counter_url?.replace(/^\//, "")}`}
                  onClick={() =>
                    setViewerImg({
                      label: "Counter View",
                      url: `${process.env.NEXT_PUBLIC_API_BASE?.replace(
                        /\/$/,
                        ""
                      )}/${shopUserData.shop_counter_url?.replace(/^\//, "")}`,
                    })
                  }
                />
              )}
              {shopUserData?.other_img_url && (
                <ImageCard
                  label="Other View"
                  url={`${process.env.NEXT_PUBLIC_API_BASE?.replace(
                    /\/$/,
                    ""
                  )}/${shopUserData.other_img_url?.replace(/^\//, "")}`}
                  onClick={() =>
                    setViewerImg({
                      label: "Other View",
                      url: `${process.env.NEXT_PUBLIC_API_BASE?.replace(
                        /\/$/,
                        ""
                      )}/${shopUserData.other_img_url?.replace(/^\//, "")}`,
                    })
                  }
                />
              )}
            </div>

            {/* --- Shop Details --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded border border-gray-200 p-4 mt-4">
              <Detail label="Username" value={shopDetails.username} />
              <Detail label="Category" value={shopDetails.category} />
              <Detail label="Shop No" value={shopDetails.userId} />
              <Detail label="Shop Name" value={shopDetails.shopname} />
              <Detail
                full
                label="Address"
                value={`${shopDetails.village}, ${shopDetails.city}, ${shopDetails.district}, ${shopDetails.state}`}
              />
            </div>

            <h2 className="text-xl mt-2 capitalize font-semibold font-roboto !leading-130">
              Listed Products
            </h2>

            <ProductDetails shopId={shopId} />
          </div>
        )}
      </div>

      {/* --- Payment Dialog --- */}
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
                  className={`text-2xl cursor-pointer transition ${
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

      {/* --- Image Viewer Dialog --- */}
      <Dialog
        open={!!viewerImg}
        onClose={() => setViewerImg(null)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4">
          <Dialog.Panel className="relative bg-white rounded-lg shadow-lg overflow-hidden max-w-3xl w-full">
            <button
              className="absolute top-2 right-2 text-white bg-black/50 rounded-full p-2 hover:bg-black/70"
              onClick={() => setViewerImg(null)}
            >
              ✕
            </button>
            {viewerImg && (
              <div className="flex flex-col items-center">
                <img
                  src={viewerImg.url}
                  alt={viewerImg.label}
                  className="max-h-[80vh] w-auto object-contain"
                />
                <div className="p-3 text-center text-gray-800 font-medium">
                  {viewerImg.label}
                </div>
              </div>
            )}
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

const ImageCard = ({ label, url, onClick }) => (
  <div
    className="border rounded-md overflow-hidden shadow-sm cursor-pointer hover:shadow-md transition"
    onClick={onClick}
  >
    <img src={url} alt={label} className="w-full h-40 object-cover" />
    <div className="p-2 text-sm text-center text-gray-700 font-medium">
      {label}
    </div>
  </div>
);

export default Page;
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

const Page = () => {
  const params = useParams();
  const shopId = params.userId;
  const userId = Cookies.get("userId");
  const token = Cookies.get("token");

  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const [shopUserData, setShopUserData] = useState(null);
  const [shopDetails, setShopDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDetails = async () => {
    try {
      const userData = await getUser(userId, token);
      setUserInfo(userData);
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

    if (!token || !userId || !shopId) {
      toast.error("Missing required details.");
      return;
    }

    try {
      const data = {
        amount: value,
        userId: userId,
        userName: userInfo?.name || "User",
        status: "pending",
        transactionId: shopId,
        totalAmount: value,
        earnAmount: value * 0.08,
        paymentMethod: "online",
      };

      await createPayment(data, token);

      const updatedUser = {
        ...userInfo,
        wallet: (userInfo?.wallet || 0) + value * 0.08,
      };

      await updateUser(updatedUser);
      toast.success(`Payment successful ₹${value}`);
      setIsOpen(false);
      setAmount("");
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Detail label="Username" value={shopDetails.username} />
              <Detail label="Shop Name" value={shopDetails.shopname} />
              <Detail label="Category" value={shopDetails.category} />
              <Detail label="SMP" value={shopDetails.smp} />
              <Detail label="GST Number" value={shopDetails.gst_number} />
              <Detail label="Pincode" value={shopDetails.pincode} />
              <Detail label="Village" value={shopDetails.village} />
              <Detail label="City" value={shopDetails.city} />
              <Detail label="District" value={shopDetails.district} />
              <Detail label="State" value={shopDetails.state} />
              <Detail label="Latitude" value={shopDetails.latitude} />
              <Detail label="Longitude" value={shopDetails.longitude} />
              <Detail
                label="Created At"
                value={new Date(shopDetails.createdAt).toLocaleString()}
              />
              <Detail
                label="Updated At"
                value={new Date(shopDetails.updatedAt).toLocaleString()}
              />
              <Detail label="Address" value={shopDetails.address} full />
            </div>

            {/* Shop Images */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              {shopDetails.shop_front_url && (
                <ImageCard label="Shop Front" url={shopUserData.shop_front_url} />
              )}
              {shopDetails.shop_counter_url && (
                <ImageCard label="Counter View" url={shopUserData.shop_counter_url} />
              )}
              {shopDetails.other_img_url && (
                <ImageCard label="Other View" url={shopUserData.other_img_url} />
              )}
            </div>

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
    <img src={url} alt={label} className="w-full h-40 object-cover" />
    <div className="p-2 text-sm text-center text-gray-700 font-medium">{label}</div>
  </div>
);

export default Page;

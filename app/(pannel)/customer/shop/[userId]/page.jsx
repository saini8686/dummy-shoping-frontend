"use client"; // 👈 Add this as the first line

import BottomBar from "@/components/common/BottomBar";
import HeaderCustomer from "@/components/customer/HeaderCustomer";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getBasicDetails } from "@/services/basic-details.service";
import { CustomButton } from "@/components/common/CustomButton";
import { Dialog } from "@headlessui/react";
import { createPayment } from "@/services/payment.service";
import { useParams } from 'next/navigation';
import { getUser } from "@/services/users.service"; // Import the getUser function
import Cookies from 'js-cookie';
import { ToastContainer, toast } from "react-toastify";

const Page = () => {
  const params = useParams(); // ✅ Only declared once
  const shopId = params.userId;
  const userId = Cookies.get("userId");

  console.log("Shop ID from params:", shopId);

  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    const value = parseFloat(amount);
    const token = Cookies.get("token"); // Or get from context/store

    if (isNaN(value)) {
      toast.error("Please enter a valid number.");
      try { 
        const userData = await getUser(userId, token);
        console.log(userData, 'sdfghj');
        const data = { amount: value, userId: userId, userName: userData.name, status: "pending", transactionId: shopId, totalAmount: value, earnAmount: value * .10, paymentMethod: 'online' };
        const result = await createPayment(data, token);
        console.log("Payment successful:", result);

        toast.success(`Payment successful ₹${amount}`);
        setIsOpen(false);
        setAmount("");
      } catch (error) {
        console.error("Payment failed:", error);
        setError("Payment failed. Please try again.");
      }
    }
  };


  const [shopDetails, setShopDetails] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    if (!shopId) return;
    console.log("Fetching shop details for shopId:", shopId);

    const fetchShopDetails = async () => {
      try {
        const response = await getBasicDetails(shopId);
        setShopDetails(response || null);
      } catch (error) {
        console.error("Error fetching shop details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchShopDetails();
  }, [shopId]);

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
              <Detail label="Created At" value={new Date(shopDetails.createdAt).toLocaleString()} />
              <Detail label="Updated At" value={new Date(shopDetails.updatedAt).toLocaleString()} />
              <Detail label="Address" value={shopDetails.address} full />
            </div>
            <div className="flex justify-center mt-4">
              <img src={shopDetails.qrCode} />
            </div>
            <CustomButton
              url="#"
              customClass="mt-2 w-fit text-sm w-full text-center"
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
    </div >
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

export default Page;

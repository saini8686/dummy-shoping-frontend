"use client"
import { CustomButton } from "@/components/common/CustomButton";
import Icon from "@/components/common/Icons";
import { useState } from "react";
import { Dialog } from "@headlessui/react";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getUser } from "@/services/users.service"
import { createPayment } from "@/services/payment.service"

const TotalAmount = (params) => {
  const totalAmount = params.total;
  const isAdmin = params.isAdmin;
  const isShopkeeper = params.isShopkeeper;
  const breakdown = params.breakdown;

  const token = Cookies.get("token");
  const userId = Cookies.get("userId");

  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState("");

  const [showBalance, setShowBalance] = useState(false);
  const [showBalance1, setShowBalance1] = useState(false);
  const [showBalance2, setShowBalance2] = useState(false);

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


    if (!token || !userId) {
      toast.error("Missing required details.");
      return;
    }

    try {
      const userInfo = await getUser(userId, token);

      const data = {
        userId: userId,
        userName: userInfo?.name || "Shopkeeper",
        earnAmount: 0,
        totalAmount: value,
        paymentMethod: "recharge",
        transactionId: 1,
        rating: 0,
        status: "pending",
        filepath: ""
      };

      console.log(data);
      
      await createPayment(data, token);

      toast.success(`Requested successful ₹${value}`);
      setIsOpen(false);
      setAmount("");
      setRating(0);
    } catch (error) {
      toast.error("Recharge request failed. Please try again.");
    }
  };

  return (
    <>
    <ToastContainer />
      <div className="px-6 w-full bg-greens-900/10 rounded-lg py-4">
        <div className="flex justify-between items-center">
          <h2 className="text-blacks-200 text-sm !leading-130">
            YOUR WALLET BALANCE
          </h2>
          <button onClick={() => setShowBalance((prev) => !prev)}>
            <Icon icon="greenEye" />
          </button>
        </div>
        <p className="text-greens-900 text-2xl !leading-130 mt-3">
          {showBalance
            ? isAdmin
              ? (breakdown?.wallet ?? 0).toFixed(2)
              : isShopkeeper
                ? (totalAmount?.recharge ?? 0).toFixed(2)
                : (totalAmount?.wallet ?? 0).toFixed(2)
            : "*******"}
        </p>
        {isShopkeeper && <CustomButton
          url="#"
          customClass="mt-4 w-fit text-sm w-full text-center"
          onClick={(e) => {
            e.preventDefault();
            setIsOpen(true);
          }}
        >
          Recharge
        </CustomButton>}
      </div>
      {isAdmin &&
        <div className="flex justify-between items-center pt-3">
          <div className="px-6 w-full bg-greens-900/10 rounded-lg py-4 mr-2">
            <div className="flex justify-between items-center">
              <h2 className="text-blacks-200 text-sm !leading-130">
                COMPANY 1
              </h2>
              <button onClick={() => setShowBalance1((prev) => !prev)}>
                <Icon icon="greenEye" />
              </button>
            </div>
            <p className="text-greens-900 text-2xl !leading-130 mt-3">
              {showBalance1 ? breakdown?.wallet1 || 0.0 : "*******"}
            </p>
          </div>
          <div className="px-6 w-full bg-greens-900/10 rounded-lg py-4 ms-2">
            <div className="flex justify-between items-center">
              <h2 className="text-blacks-200 text-sm !leading-130">
                COMPANY 2
              </h2>
              <button onClick={() => setShowBalance2((prev) => !prev)}>
                <Icon icon="greenEye" />
              </button>
            </div>
            <p className="text-greens-900 text-2xl !leading-130 mt-3">
              {showBalance2 ? breakdown?.wallet2 || 0.0 : "*******"}
            </p>
          </div>
        </div>
      }
      {/* Popup Dialog */}
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md bg-white rounded-lg p-6 shadow-lg">
            <Dialog.Title className="text-lg font-semibold text-gray-800 mb-4">
              Enter the recharge amount
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
    </>
  );
};

export default TotalAmount;

"use client";

import { useState } from "react";
import { Dialog } from "@headlessui/react";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { CustomButton } from "@/components/common/CustomButton";
import Icon from "@/components/common/Icons";
import { getUser, updateUser, updateUserWallet2UsingSMP } from "@/services/users.service";
import { createPayment } from "@/services/payment.service";
import Link from "next/link";
import { createWithdrawal } from "@/services/transactions.service";
import { createNotification } from "@/services/notification.service";
import { useRouter } from "next/navigation"; 


const TotalAmount = ({ total, isAdmin, isshopkepper, breakdown }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenSMP, setIsOpenSMP] = useState(false);
  const [amount, setAmount] = useState("");
  const [smp, setSMP] = useState("");
  const [showBalance, setShowBalance] = useState(false);
  const [showBalance1, setShowBalance1] = useState(false);
  const [showBalance2, setShowBalance2] = useState(false);
  const [isOpenWithdrawal, setIsOpenWithdrawal] = useState(false);
  const router = useRouter();


  const token = Cookies.get("token");
  const userId = Cookies.get("userId");

  const [amountWithdrawal, setAmountWithdrawal] = useState("");
  const [method, setMethod] = useState("bank");

  // Separate states for each method
  const [bankDetails, setBankDetails] = useState({
    holderName: "",
    accountNumber: "",
    ifsc: "",
  });

  const [upiId, setUpiId] = useState("");
  const [paypalEmail, setPaypalEmail] = useState("");

  const handleFormSubmit = async () => {
    const value = parseFloat(amountWithdrawal);

    // ✅ Validate minimum request amount
    if (isNaN(value) || value < 100) {
      toast.error("Minimum withdrawal request amount is 100.");
      return;
    }

    let payload = { amount: value, method };

    if (method === "bank") {
      payload = { ...payload, ...bankDetails };
    } else if (method === "upi") {
      payload = { ...payload, ...bankDetails, upiId };
    } else if (method === "paypal") {
      payload = { ...payload, ...bankDetails, paypalEmail };
    }

    const userInfo = await getUser(userId, token);

    try {
      // ✅ Check balance before withdrawal
      if ((userInfo?.wallet2 || 0) < value) {
        toast.error("Insufficient balance for withdrawal.");
        return;
      }

      // ✅ Deduct balance first
      const newBalance = (userInfo.wallet2 || 0) - value;
      await updateUser({
        ...userInfo,
        wallet2: newBalance,
      });

      const data = {
        userId,
        userName: userInfo?.name || "user",
        receiverName: payload.holderName || "N/A",
        paymentType: payload.method,
        transactionAmount: value,
        paymentMethod: "recharge",
        transactionId:
          payload.upiId || payload.paypalEmail || payload.accountNumber || "N/A",
        status: "pending",
        filename: "",
        filepath: "",
        mimetype: payload.ifsc || "N/A",
      };

      await createNotification({
        userId, // or the admin userId
        message: `New withdrawal request from ${userInfo?.name} of ₹${amountWithdrawal}.`,
        earnCoin: 0,
        earnType: "withdrawal_request",
        earnUserId: userInfo?.userId,
        earnUserName: userInfo?.name || "user",
        status: "pending",
      });

      await createWithdrawal(data);

      // ✅ Update UI instantly
      if (typeof setTotal === "function") {
        setTotal((prev) => ({ ...prev, wallet2: newBalance }));
      }

      toast.success("Withdrawal Request submitted successfully!");
      router.push("./withdrawal-request");
    } catch (error) {
      console.error(error);

      // ❌ Rollback on failure
      await updateUser({
        ...userInfo,
        wallet2: userInfo.wallet2 || 0,
      });

      toast.error("Unable to create the Withdrawal Request. Amount refunded.");
    }

    setIsOpenWithdrawal(false);
  };


  const handleSubmit = async () => {
    const value = parseFloat(amount);

    if (isNaN(value) || value <= 0) {
      toast.error("Please enter a valid amount greater than zero.");
      return;
    }

    if (!token || !userId) {
      toast.error("Missing authentication information.");
      return;
    }

    try {
      const userInfo = await getUser(userId, token);

      const data = {
        userId,
        userName: userInfo?.name || "shopkepper",
        earnAmount: 0,
        totalAmount: value,
        paymentMethod: "recharge",
        transactionId: 1,
        rating: 0,
        status: "pending",
        filepath: "",
        shopId: userId,
        shopName: "shopkepper",
      };

      await createPayment(data, token);

      toast.success(`Recharge request successful for ${value.toFixed(2)}`);
      setIsOpen(false);
      setAmount("");
    } catch (error) {
      toast.error("Recharge request failed. Please try again.");
    }
  };

  const handleSubmitSMP = async () => {
    const value = parseFloat(smp);

    if (isNaN(value) || value <= 0) {
      toast.error("Please enter a valid amount greater than zero.");
      return;
    }

    if (!token || !smp) {
      toast.error("Missing authentication information.");
      return;
    }

    try {
      const userInfo = await updateUserWallet2UsingSMP(smp, token);

      userInfo && toast.success(`Customer Unlock Wallet updated successfully`);
      setIsOpenSMP(false);
      setSMP("");
    } catch (error) {
      toast.error("Recharge request failed. Please try again.");
    }
  };

  const formatAmount = (val) => Number(val ?? 0).toFixed(2);

  return (
    <>
      <ToastContainer />
      <div className="px-6 w-full bg-greens-900/10 rounded-lg py-4">
        <div className="flex justify-between items-center">
          <h2 className="text-blacks-200 text-sm">{isshopkepper ? "RECHARGE WALLET" : "YOUR LOCKED WALLET"}</h2>
          <button onClick={() => setShowBalance((prev) => !prev)}>
            <Icon icon="greenEye" />
          </button>
        </div>
        <p className="text-greens-900 text-2xl mt-3">
          {showBalance
            ? isAdmin
              ? formatAmount(breakdown?.wallet)
              : isshopkepper
                ? formatAmount(total?.recharge)
                : formatAmount(total?.wallet)
            : "*******"}
        </p>

        {isshopkepper && (
          <div className="flex flex-col sm:flex-row justify-end items-center gap-3 mt-4">
            <CustomButton
              customClass="w-full sm:w-auto text-sm px-4 py-2 bg-primary text-white rounded-sm transition"
              onClick={(e) => {
                e.preventDefault();
                setIsOpen(true);
              }}
            >
              Recharge
            </CustomButton>

            <Link
              href="/shopkepper/recharge-status"
              className="w-full sm:w-auto text-sm text-center px-4 py-2 border text-[#01BA5D] rounded-sm transition"
            >
              View Status
            </Link>
          </div>
        )}
      </div>

      {isAdmin && (
        <>
          <div className="flex justify-between items-center pt-3">
            <div className="px-6 w-full bg-greens-900/10 rounded-lg py-4 mr-2">
              <div className="flex justify-between items-center">
                <h2 className="text-blacks-200 text-sm">COMPANY 1</h2>
                <button onClick={() => setShowBalance1((prev) => !prev)}>
                  <Icon icon="greenEye" />
                </button>
              </div>
              <p className="text-greens-900 text-2xl mt-3">
                {showBalance1 ? formatAmount(breakdown?.wallet1) : "*******"}
              </p>
            </div>
            <div className="px-6 w-full bg-greens-900/10 rounded-lg py-4 ms-2">
              <div className="flex justify-between items-center">
                <h2 className="text-blacks-200 text-sm">COMPANY 2</h2>
                <button onClick={() => setShowBalance2((prev) => !prev)}>
                  <Icon icon="greenEye" />
                </button>
              </div>
              <p className="text-greens-900 text-2xl mt-3">
                {showBalance2 ? formatAmount(breakdown?.wallet2) : "*******"}
              </p>
            </div>
          </div>
          <div className="w-full mt-3">
            <CustomButton
              customClass="w-full sm:w-auto text-sm px-4 py-2 bg-primary text-white rounded-sm transition"
              onClick={(e) => {
                e.preventDefault();
                setIsOpenSMP(true);
              }}
            >
              Update Customer Unlock Wallet
            </CustomButton>
          </div>
          <div className="w-full mt-3">
            <CustomButton
              customClass="w-full sm:w-auto text-sm px-4 py-2 bg-primary text-white rounded-sm transition text-center"
              url={'./withdrawal'}
            >
              Customer Withdrawl Request
            </CustomButton>
          </div>
        </>
      )}

      {(!isAdmin && !isshopkepper) && (
        <>
          {/* Wallet Cards */}
          <div className="flex flex-col sm:flex-row justify-between items-stretch pt-3 gap-3">
            {/* COMPANY 2 */}
            <div className="flex-1 px-6 py-4 bg-greens-900/10 rounded-lg">
              <div className="flex justify-between items-center">
                <h2 className="text-blacks-200 text-sm font-medium">UNLOCK WALLET</h2>
                <button onClick={() => setShowBalance2((prev) => !prev)}>
                  <Icon icon="greenEye" />
                </button>
              </div>
              <p className="text-greens-900 text-2xl mt-3 font-semibold">
                {showBalance2 ? formatAmount(total?.wallet2) : "*******"}
              </p>
              <div className="flex gap-3 w-full">
                <CustomButton
                  onClick={() => setIsOpenWithdrawal(true)}
                  className="flex-1 px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-center"
                >
                  Withdrawal
                </CustomButton>

                <CustomButton
                  url={'./withdrawal-request'}
                  className="flex-1 px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-center"
                >
                  Withdrawal Requests
                </CustomButton>
              </div>
            </div>
          </div>
        </>
      )}


      {/* Recharge Dialog */}
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

      <Dialog open={isOpenSMP} onClose={() => setIsOpenSMP(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md bg-white rounded-lg p-6 shadow-lg">
            <Dialog.Title className="text-lg font-semibold text-gray-800 mb-4">
              Enter the transfer amount to Customer Unlock Wallet in %
            </Dialog.Title>

            <input
              type="number"
              placeholder="Amount in %"
              value={smp}
              onChange={(e) => setSMP(e.target.value)}
              className="w-full px-4 py-2 border rounded-md mb-4 focus:outline-none focus:ring focus:border-blue-300"
            />

            <div className="flex justify-end gap-2">
              <CustomButton
                onClick={() => setIsOpenSMP(false)}
                className="px-4 py-2 rounded-md !bg-transparent !text-[#01be62] hover:!bg-gray-100"
              >
                Cancel
              </CustomButton>
              <CustomButton
                onClick={handleSubmitSMP}
                className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white"
              >
                Submit
              </CustomButton>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      <Dialog
        open={isOpenWithdrawal}
        onClose={() => setIsOpenWithdrawal(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md bg-white rounded-lg p-6 shadow-lg">
            <Dialog.Title className="text-lg font-semibold text-gray-800 mb-4">
              Withdrawal Request Form
            </Dialog.Title>

            {/* Amount */}
            <input
              type="number"
              placeholder="Enter amount"
              value={amountWithdrawal}
              onChange={(e) => setAmountWithdrawal(e.target.value)}
              className="w-full px-4 py-2 border rounded-md mb-4 focus:outline-none focus:ring focus:border-blue-300"
            />

            {/* Withdrawal Method */}
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="w-full px-4 py-2 border rounded-md mb-4 focus:outline-none focus:ring focus:border-blue-300"
            >
              <option value="bank">Bank Transfer</option>
              <option value="upi">UPI</option>
              <option value="paypal">PayPal</option>
            </select>

            {/* Conditional Fields */}
            {method === "bank" && (
              <div className="space-y-3 mb-4">
                <input
                  type="text"
                  placeholder="Account Holder Name"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                  value={bankDetails.holderName}
                  onChange={(e) =>
                    setBankDetails({ ...bankDetails, holderName: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="Account Number"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                  value={bankDetails.accountNumber}
                  onChange={(e) =>
                    setBankDetails({ ...bankDetails, accountNumber: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="IFSC Code"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                  value={bankDetails.ifsc}
                  onChange={(e) =>
                    setBankDetails({ ...bankDetails, ifsc: e.target.value })
                  }
                />
              </div>
            )}

            {method === "upi" && (
              <>
                <input
                  type="text"
                  placeholder="Account Holder Name"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                  value={bankDetails.holderName}
                  onChange={(e) =>
                    setBankDetails({ ...bankDetails, holderName: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="Enter UPI ID (e.g. name@upi)"
                  className="w-full px-4 mt-3 py-2 border rounded-md mb-4 focus:outline-none focus:ring focus:border-blue-300"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                />
              </>
            )}

            {method === "paypal" && (
              <>
                <input
                  type="text"
                  placeholder="Account Holder Name"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                  value={bankDetails.holderName}
                  onChange={(e) =>
                    setBankDetails({ ...bankDetails, holderName: e.target.value })
                  }
                />
                <input
                  type="email"
                  placeholder="Enter PayPal Email"
                  className="w-full px-4 mt-3 py-2 border rounded-md mb-4 focus:outline-none focus:ring focus:border-blue-300"
                  value={paypalEmail}
                  onChange={(e) => setPaypalEmail(e.target.value)}
                />
              </>
            )}

            {/* Buttons */}
            <div className="flex justify-end gap-2">
              <CustomButton
                onClick={() => setIsOpenWithdrawal(false)}
                className="px-4 py-2 rounded-md !bg-transparent !text-[#01be62] hover:!bg-gray-100"
              >
                Cancel
              </CustomButton>
              <CustomButton
                onClick={handleFormSubmit}
                className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white"
              >
                Submit Request
              </CustomButton>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
};

export default TotalAmount; 
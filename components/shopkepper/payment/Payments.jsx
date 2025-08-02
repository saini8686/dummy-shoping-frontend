"use client";
import React, { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { getAllPayments, updatePayment } from "@/services/payment.service";
import { getBasicDetails } from "@/services/basic-details.service";
import { getAllUserList, getUser, updateUser } from "@/services/users.service";
import { createNotification } from "@/services/notification.service";

import { CustomButton } from "@/components/common/CustomButton";
import Icon from "@/components/common/Icons";

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [shopDetails, setShopDetails] = useState(null);
  const [shopkeeprData, setShopkeeprData] = useState(null);
  const [adminInfo, setAdminInfo] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const userId = Cookies.get("userId");
      const allUser = await getAllUserList();
      const adminUser = allUser.find((item) => item.isAdmin);
      setAdminInfo(adminUser);

      const all = await getAllPayments();
      const filtered = Array.isArray(all)
        ? all
            .filter((item) => String(item.transactionId) === String(userId))
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        : [];
      setPayments(filtered);
    } catch {
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserDetails = async () => {
    const userId = Cookies.get("userId");
    const token = Cookies.get("token");
    const shopData = await getBasicDetails(userId);
    const keeperData = await getUser(userId, token);
    setShopDetails(shopData || null);
    setShopkeeprData(keeperData || null);
  };

  useEffect(() => {
    fetchPayments();
    fetchUserDetails();
  }, []);

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setIsOpen(true);
  };

  const handleApprove = async (user, status) => {
    try {
      const token = Cookies.get("token");

      if (status === "approved") {
        if (shopkeeprData?.recharge < user.totalAmount) {
          toast.error("Insufficient balance to approve this payment. Please recharge your account.");
          return;
        }

        const userData = await getUser(user.userId, token);
        const smp = shopDetails?.smp || 1;
        const smpPr = Number(smp) / 100;
        const earnAmount = Number(user.totalAmount) * smpPr;

        await updateUser({
          ...userData,
          wallet: (userData.wallet || 0) + earnAmount,
        });

        await createNotification({
          userId: user.userId,
          message: `Your payment of ₹${Number(user.totalAmount).toFixed(2)} has been approved.`,
          earnCoin: earnAmount,
          earnType: "shopping",
          earnUserId: user.userId,
          earnUserName: "self",
          status: "sent",
        });

        const adminCommission1 = user.totalAmount * smpPr * 0.05;
        const adminCommission2 = user.totalAmount * smpPr * 0.25;

        await createNotification({
          userId: user.userId,
          message: `₹${user.totalAmount.toFixed(2)} of 5% has been approved.`,
          earnCoin: adminCommission1.toFixed(2),
          earnType: "company1",
          earnUserId: user.userId,
          earnUserName: user.name,
          status: "sent",
        });
        await createNotification({
          userId: user.userId,
          message: `₹${user.totalAmount.toFixed(2)} of 25% has been approved.`,
          earnCoin: adminCommission2.toFixed(2),
          earnType: "company2",
          earnUserId: user.userId,
          earnUserName: user.name,
          status: "sent",
        });

        await updateUser({
          ...adminInfo,
          wallet1: Number(adminInfo.wallet1 || 0) + adminCommission1,
          wallet2: Number(adminInfo.wallet2 || 0) + adminCommission2,
        });

        await updateUser({
          ...shopkeeprData,
          recharge: (shopkeeprData.recharge || 0) - user.totalAmount,
        });

        if (userData?.parentUserId) {
          const parentData = await getUser(userData.parentUserId, token);
          const referralEarn = user.totalAmount * smpPr * 0.2;

          await updateUser({
            ...parentData,
            wallet: Number(parentData.wallet || 0) + referralEarn,
          });

          await createNotification({
            userId: userData.userId,
            message: `You earned ₹${referralEarn.toFixed(2)} from your referral ${userData.name}'s payment.`,
            earnCoin: referralEarn.toFixed(2),
            earnType: "referral",
            earnUserId: parentData.userId,
            earnUserName: parentData.name,
            status: "sent",
          });
        }
      } else if (status === "rejected") {
        await createNotification({
          userId: user.userId,
          message: `Your payment of ₹${user.totalAmount.toFixed(2)} has been rejected.`,
          earnCoin: 0,
          earnType: "payment",
          earnUserId: user.userId,
          earnUserName: user.userName,
          status: "sent",
        });
      }

      await updatePayment(user.payId, { ...user, status });
      toast.success(`Payment ${status} successfully`);
      setIsOpen(false);
      fetchPayments();
    } catch {
      toast.error("Failed to update payment.");
    }
  };

  const filteredPayments =
    filterStatus === "all"
      ? payments
      : payments.filter((p) => p.status === filterStatus);

  return (
    <div className="mt-10 max-w-5xl mx-auto">
      <ToastContainer position="top-right" />

      {/* Status Filter */}
      <div className="flex justify-end mb-4 gap-2 px-2">
        {["all", "pending", "approved", "rejected"].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-1 text-sm rounded-full border ${
              filterStatus === status
                ? "bg-greens-900 text-white"
                : "bg-white text-gray-600"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-center text-gray-500 mt-10">Loading payments...</p>
      ) : filteredPayments.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">No payments found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6 pt-4">
          {filteredPayments.map((obj, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-transform hover:scale-[1.015]"
            >
              {/* Header */}
              <div className="bg-greens-900 px-5 py-3 flex justify-between items-center text-white rounded-t-2xl">
                <h2 className="font-semibold text-base">#{i + 1} • {obj?.userName}</h2>
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded-full uppercase tracking-wide ${
                    obj.status === "approved"
                      ? "bg-green-200 text-green-800"
                      : obj.status === "pending"
                      ? "bg-yellow-200 text-yellow-800"
                      : "bg-red-200 text-red-800"
                  }`}
                >
                  {obj.status}
                </span>
              </div>

              {/* Body */}
              <div className="px-5 py-4 text-gray-800 text-sm space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Amount</span>
                  <span className="text-lg text-green-700 font-bold">₹{Number(obj?.totalAmount ?? 0).toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Shop</span>
                  <span>{obj?.mimetype ?? "Shop Name"} ({obj?.transactionId ?? "N/A"})</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Method</span>
                  <span>{obj?.paymentMethod ?? "N/A"}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Rating</span>
                  <span className="text-yellow-600 font-medium">{obj?.rating ?? "N/A"}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Date</span>
                  <span>{new Date(obj?.createdAt).toLocaleString("en-IN", {
                    dateStyle: "medium", timeStyle: "short"
                  })}</span>
                </div>
              </div>

              {/* Action */}
              <div className="px-5 pb-4">
                <button
                  onClick={() => handleViewDetails(obj)}
                  className="w-full bg-greens-900 hover:bg-greens-800 text-white text-sm font-semibold py-2 rounded-xl transition duration-200"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Dialog */}
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <Dialog.Title className="text-xl font-semibold mb-4">Payment Details</Dialog.Title>
              <button
                className="px-4 py-2 rounded bg-gray-300 text-gray-800 hover:bg-gray-400"
                onClick={() => setIsOpen(false)}
              >
                <Icon icon="close" />
              </button>
            </div>
            {selectedUser && (
              <div className="space-y-3 text-sm text-gray-700">
                <p><strong>User Name:</strong> {selectedUser.userName}</p>
                <p><strong>Shop:</strong> {selectedUser.mimetype ?? "Shop name"} ({selectedUser.transactionId})</p>
                <p><strong>Amount:</strong> ₹{selectedUser.totalAmount}</p>
                <p><strong>Payment Method:</strong> {selectedUser.paymentMethod}</p>
                <p><strong>Status:</strong> {selectedUser.status}</p>
              </div>
            )}
            {selectedUser?.status === "pending" && (
              <div className="mt-6 flex justify-end gap-3">
                <CustomButton
                  disabled={selectedUser?.totalAmount > 5000}
                  onClick={() => handleApprove(selectedUser, "rejected")}
                  className="px-4 py-2 rounded text-white bg-red-600 hover:bg-red-700"
                >
                  Reject
                </CustomButton>
                <CustomButton
                  disabled={selectedUser?.totalAmount > 5000}
                  onClick={() => handleApprove(selectedUser, "approved")}
                  className="px-4 py-2 rounded text-white bg-green-600 hover:bg-green-700"
                >
                  Approve
                </CustomButton>
              </div>
            )}
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default Payments;

"use client";
import React, { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { getAllPayments, updatePayment } from "@/services/payment.service";
import { getUser, updateUser } from "@/services/users.service";
import { createNotification } from "@/services/notification.service";
import { CustomButton } from "@/components/common/CustomButton";
import Icon from "@/components/common/Icons";
import { getBasicDetails } from "@/services/basic-details.service";

const Recharges = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [adminInfo, setAdminInfo] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");

  const getPercentageLabel = (value) => {
    const map = {
      3: 1, 5: 2, 10: 3, 12: 4, 15: 5, 20: 8, 25: 10, 30: 15, 40: 20, 50: 25,
    };
    return map[value] ?? 0;
  };

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const userId = Cookies.get("userId");
      const token = Cookies.get("token");

      const [adminUser, allPayments] = await Promise.all([
        getUser(userId, token),
        getAllPayments(),
      ]);

      setAdminInfo(adminUser);

      const filtered = Array.isArray(allPayments)
        ? allPayments
            .filter((p) => p.paymentMethod === "recharge")
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        : [];

      setPayments(filtered);
    } catch (error) {
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setIsOpen(true);
  };

  const handleApprove = async (user, status) => {
    setIsProcessing(true);
    try {
      const token = Cookies.get("token");
      const totalAmount = Number(user.totalAmount);
      const userData = await getUser(user.userId, token);
      const shopData = await getBasicDetails(user.userId);
      const smp = Number(shopData?.smp || 0);
      const smpToPs = getPercentageLabel(smp);
      const smpPercent = smpToPs * 0.01;

      if (status === "approved") {
        const updatedUser = {
          ...userData,
          recharge: (userData.recharge || 0) + totalAmount,
        };
        await updateUser(updatedUser);

        const rechargeAmount = totalAmount * smpPercent;

        await createNotification({
          userId: user.userId,
          message: `Your recharge of ₹${totalAmount.toFixed(2)} has been approved.`,
          earnCoin: rechargeAmount,
          earnType: "recharge",
          earnUserId: user.userId,
          earnUserName: userData?.name || "self",
          status: "sent",
        });

        const updatedAdmin = {
          ...adminInfo,
          wallet: Number(((adminInfo.wallet || 0) + rechargeAmount).toFixed(2)),
        };
        await updateUser(updatedAdmin);
      }

      if (status === "rejected") {
        await createNotification({
          userId: user.userId,
          message: `Your recharge of ₹${totalAmount.toFixed(2)} has been rejected.`,
          earnCoin: 0,
          earnType: "recharge",
          earnUserId: user.userId,
          earnUserName: userData?.name || "",
          status: "rejected",
        });
      }

      await updatePayment(user.payId, { ...user, status });

      toast.success(`Recharge ${status} successfully`);
      setIsOpen(false);
      fetchPayments();
    } catch (error) {
      toast.error("Failed to update recharge.");
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredPayments = payments.filter((p) => {
    if (statusFilter === "all") return true;
    return p.status === statusFilter;
  });

  return (
    <div className="mt-10 max-w-5xl mx-auto">
      <ToastContainer position="top-right" />

      {/* Status Filter */}
      <div className="flex justify-end mb-4 gap-2 px-2">
        {["all", "pending", "approved", "rejected"].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-1 text-sm rounded-full border ${
              statusFilter === status
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          {filteredPayments.map((obj, i) => (
            <div
              key={obj.payId || i}
              className="bg-white rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-transform hover:scale-[1.015]"
            >
              <div className="bg-greens-900 px-5 py-3 flex justify-between items-center text-white rounded-t-2xl">
                <h2 className="font-semibold text-base">
                  #{i + 1} • {obj?.userName}
                </h2>
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

              <div className="px-5 py-4 text-gray-800 text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Amount</span>
                  <span className="text-lg text-green-700 font-bold">
                    ₹{Number(obj?.totalAmount ?? 0).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Shop</span>
                  <span>
                    {obj?.shopName ?? "Shop Name"} ({obj?.shopId ?? "N/A"})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Payment Type</span>
                  <span>{obj?.paymentMethod ?? "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Date</span>
                  <span>
                    {new Date(obj?.createdAt).toLocaleString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </span>
                </div>
              </div>

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
              <Dialog.Title className="text-xl font-semibold mb-4">
                Payment Details
              </Dialog.Title>
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
                <p><strong>Shop:</strong> {selectedUser.shopName ?? "Shop name"} ({selectedUser.shopId})</p>
                <p><strong>Amount:</strong> ₹{selectedUser.totalAmount}</p>
                <p><strong>Payment Method:</strong> {selectedUser.paymentMethod}</p>
                <p><strong>Status:</strong> {selectedUser.status}</p>
              </div>
            )}

            {selectedUser?.status === "pending" && (
              <div className="mt-6 flex justify-end gap-3">
                <CustomButton
                  disabled={isProcessing || selectedUser?.totalAmount > 5000}
                  onClick={() => handleApprove(selectedUser, "rejected")}
                  className="px-4 py-2 rounded text-white bg-red-600 hover:bg-red-700"
                >
                  {isProcessing ? "Processing..." : "Reject"}
                </CustomButton>
                <CustomButton
                  disabled={isProcessing || selectedUser?.totalAmount > 5000}
                  onClick={() => handleApprove(selectedUser, "approved")}
                  className="px-4 py-2 rounded text-white bg-green-600 hover:bg-green-700"
                >
                  {isProcessing ? "Processing..." : "Approve"}
                </CustomButton>
              </div>
            )}
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default Recharges;

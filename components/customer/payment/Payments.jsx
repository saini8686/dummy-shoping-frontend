"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Dialog } from "@headlessui/react";
import { getAllPayments, updatePayment } from "@/services/payment.service";
import { CustomButton } from "@/components/common/CustomButton";
import Cookies from "js-cookie";
import Icon from "@/components/common/Icons";

const CoustomerPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0); // ✅ Fix: add setRating

  const fetchPayments = () => {
    setLoading(true);
    const userId = Cookies.get("userId");

    getAllPayments()
      .then((res) => {
        if (Array.isArray(res)) {
          const filtered = res.filter(
            (item) => String(item.userId) === String(userId)
          );
          setPayments(filtered);
        } else {
          console.warn("Expected an array from getAllPayments, got:", res);
          setPayments([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching payments:", err);
        setPayments([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setRating(user.rating || 0); // preload previous rating if any
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setSelectedUser(null);
    setRating(0);
  };

  const handleApprove = async (user, status) => {
    try {
      if (!user?.userId) {
        alert("Invalid user data.");
        return;
      }

      const updatedUser = { ...user, status, rating };

      const res = await updatePayment(user.payId, updatedUser);
      alert("Payment updated successfully!");

      setIsOpen(false);
      fetchPayments();
    } catch (error) {
      console.error("Approval failed:", error);
      alert("Failed to update payment.");
    }
  };

  if (loading)
    return (
      <p className="text-center text-gray-500 mt-10">Loading payments...</p>
    );
  if (!payments?.length)
    return (
      <p className="text-center text-gray-500 mt-10">No payments found.</p>
    );

  return (
    <div className="mt-10 max-w-5xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-3">
        {payments.map((obj, i) => (
          <div
            key={i}
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
          >
            <div className="bg-greens-900 px-4 py-2 text-white flex justify-between items-center">
              <h2 className="font-semibold text-sm">
                #{i + 1} • {obj.userName}
              </h2>
              <span
                className={`text-xs font-semibold px-2 py-1 rounded-full ${obj.status === "approved"
                    ? "bg-green-200 text-green-900"
                    : "bg-yellow-200 text-yellow-900"
                  }`}
              >
                {obj.status.toUpperCase()}
              </span>
            </div>

            <div className="px-4 py-3 text-sm text-gray-800 space-y-2">
              <div>
                <strong>Amount:</strong> ₹{obj.totalAmount}
              </div>
              <div>
                <strong>Earned:</strong> {obj.earnAmount} SMP
              </div>
              <div>
                <strong>Method:</strong> {obj.paymentMethod}
              </div>
            </div>

            <div className="px-4 pb-4">
              <button
                onClick={() => handleViewDetails(obj)}
                className="w-full bg-greens-900 text-white font-medium py-2 mt-2 rounded-md hover:bg-blue-700 transition"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <Dialog open={isOpen} onClose={handleClose} className="relative z-50">
        <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <Dialog.Title className="text-xl font-semibold mb-4">
                Payment Details
              </Dialog.Title>
              <button
                className="px-4 py-2 rounded bg-gray-300 text-gray-800 hover:bg-gray-400"
                onClick={handleClose}
              >
                <Icon icon="close" />
              </button>
            </div>

            {selectedUser && (
              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex items-center justify-center mb-4">
                  <Image
                    src={selectedUser.productImage || "/placeholder.png"}
                    alt="user"
                    width={100}
                    height={100}
                    className="rounded-lg object-cover"
                  />
                </div>
                <p>
                  <strong>User Name:</strong> {selectedUser.userName}
                </p>
                <p>
                  <strong>Amount:</strong> ₹{selectedUser.totalAmount}
                </p>
                <p>
                  <strong>Status:</strong> {selectedUser.status}
                </p>
                <p>
                  <strong>Shop No:</strong> {selectedUser.transactionId}
                </p>
                <p>
                  <strong>Payment Method:</strong> {selectedUser.paymentMethod}
                </p>
              </div>
            )}

            {/* ⭐ Rating */}
            <div className="mt-6">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Rate this user:
              </p>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    className="text-yellow-400 hover:scale-110 transition-transform"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill={rating >= star ? "currentColor" : "none"}
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.518 4.674a1 1 0 00.95.69h4.908c.969 0 1.371 1.24.588 1.81l-3.974 2.888a1 1 0 00-.364 1.118l1.518 4.674c.3.921-.755 1.688-1.538 1.118l-3.974-2.888a1 1 0 00-1.175 0l-3.974 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.364-1.118L2.465 10.1c-.783-.57-.38-1.81.588-1.81h4.908a1 1 0 00.95-.69l1.518-4.674z"
                      />
                    </svg>
                  </button>
                ))}
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default CoustomerPayments;

"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Dialog } from "@headlessui/react";
import { getAllPayments, updateProduct } from "@/services/payment.service";
import { CustomButton } from "@/components/common/CustomButton";

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const fetchPayments = () => {
    setLoading(true);
    getAllPayments()
      .then((res) => setPayments(res))
      .catch((err) => console.error("Error fetching payments:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setIsOpen(true);
  };

  const handleApprove = async (user, status) => {
    try {
      console.log("Approving payment for user:", user);
      
      if (!user || !user.userId) {
        alert("Invalid user data.");
        return;
      }
      user.status = status; // Update status to approved
      var res = await updateProduct(user.userId, user);
      alert("Payment approved successfully!");
      console.log("Payment approved:", res);
      
      setIsOpen(false);
      fetchPayments();
    } catch (error) {
      console.error("Approval failed:", error);
      alert("Failed to approve payment.");
    }
  };

  if (loading) return <p className="text-center text-gray-500 mt-10">Loading payments...</p>;
  if (!payments || payments.length === 0)
    return <p className="text-center text-gray-500 mt-10">No payments found.</p>;

  return (
    <div className="mt-10 max-w-5xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Payment Records</h2>
      <div className="w-full overflow-x-auto">
        <div className="space-y-5">
          {payments.map((obj, i) => (
            <div
              key={i}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            >
              {/* Header */}
              <div className="bg-greens-900 px-4 py-2 text-white flex justify-between items-center">
                <h2 className="font-semibold text-sm">#{i + 1} • {obj.userName}</h2>
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded-full ${obj.status === "approved"
                      ? "bg-green-200 text-green-900"
                      : "bg-yellow-200 text-yellow-900"
                    }`}
                >
                  {obj.status.toUpperCase()}
                </span>
              </div>

              {/* Info List */}
              <div className="px-4 py-3 text-sm text-gray-800 space-y-2">
                <div><strong className="">Amount:</strong> ₹{obj.totalAmount}</div>
                <div><strong className="">Earned:</strong> ₹{obj.earnAmount}</div>
                <div><strong className="">Method:</strong> {obj.paymentMethod}</div>
              </div>

              {/* Action Button */}
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
      </div>


      {/* ✅ Popup Modal */}
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <Dialog.Title className="text-xl font-semibold mb-4">Payment Details</Dialog.Title>

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
                <p><strong>User Name:</strong> {selectedUser.userName}</p>
                <p><strong>Amount:</strong> ₹{selectedUser.totalAmount}</p>
                <p><strong>Status:</strong> {selectedUser.status}</p>
                <p><strong>Shop No:</strong> {selectedUser.transactionId}</p>
                <p><strong>Payment Method:</strong> {selectedUser.paymentMethod}</p>
              </div>
            )}

            <div className="mt-6 flex justify-between">
              <button
                className="px-4 py-2 rounded bg-gray-300 text-gray-800 hover:bg-gray-400"
                onClick={() => setIsOpen(false)}
              >
                Close
              </button>
              <CustomButton
                disabled={selectedUser?.totalAmount > 5000}
                onClick={() => handleApprove(selectedUser, 'rejected')}
                className={`px-4 py-2 rounded text-white ${selectedUser?.totalAmount > 5000
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
                  }`}
              >
                Reject
              </CustomButton>
              <CustomButton
                disabled={selectedUser?.totalAmount > 5000}
                onClick={() => handleApprove(selectedUser, 'approved')}
                className={`px-4 py-2 rounded text-white ${selectedUser?.totalAmount > 5000
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
                  }`}
              >
                Approve
              </CustomButton>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default Payments;

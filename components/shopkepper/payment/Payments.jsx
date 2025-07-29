// Payments.tsx
"use client";
import React, { use, useEffect, useState } from "react";
import Image from "next/image";
import { Dialog } from "@headlessui/react";
import { getAllPayments, updateProduct } from "@/services/payment.service";
import { getBasicDetails } from "@/services/shop.service";
import { getUser, updateUser } from "@/services/users.service";
import { createNotification } from "@/services/notification.service";
import { CustomButton } from "@/components/common/CustomButton";
import Cookies from "js-cookie";

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [shopDetails, setShopDetails] = useState(null);
  const [shopkeeprData, setShopkeeprData] = useState(null);
  const [adminInfo, setAdminInfo] = useState(null);

  const fetchPayments = () => {
    setLoading(true);
    const userId = Cookies.get("userId");
    getAllPayments()
      .then((res) => {
        if (Array.isArray(res)) {
          const filtered = res.filter((item) => String(item.transactionId) === String(userId));
          setPayments(filtered);
        } else {
          setPayments([]);
        }
      })
      .catch(() => setPayments([]))
      .finally(() => setLoading(false));
  };

  const fetchUserDetails = async () => {
    const userId = Cookies.get("userId");
    const token = Cookies.get("token");
    const shopData = await getBasicDetails(userId);
    setShopDetails(shopData || null);
    const shopkeeprData = await getUser(userId, token);
    setShopkeeprData(shopkeeprData || null);
    const adminData = await getUser(1, token);
    setAdminInfo(adminData);
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
      const userId = Cookies.get("userId");

      if (!user || !user.userId) {
        alert("Invalid user data.");
        return;
      }


      const userData = await getUser(user.userId, token);

      const totalAmount = payments.totalAmount || 0;
      const smp = shopDetails?.smp || 0;

      // if (status === "approved" && shopkeeprData.recharge > totalAmount) {
      if (status === "approved") {
        // Earned amount for user
        const earnAmount = totalAmount * (smp * 0.01);
        const updatedUser = {
          ...userData,
          wallet: (userData?.wallet || 0) + earnAmount,
        };

        payments.earnAmount = earnAmount;

        await updateUser(updatedUser);

        await createNotification({
          userId: user.userId,
          message: `Your payment of ₹${totalAmount} has been approved.`,
          earnCoin: earnAmount,
          earnType: "shoping",
          earnUserId: user.userId,
          earnUserName: userData?.name || "",
          status: "sent",
        });

        // Admin commission
        const adminCommission1 = totalAmount * smp * 0.05;
        const adminCommission2 = totalAmount * smp * 0.25;
        const updatedAdmin = {
          ...adminInfo,
          wallet: (adminInfo?.wallet || 0) + adminCommission1,
          wallet2: (adminInfo?.wallet2 || 0) + adminCommission2,
        };
        await updateUser(updatedAdmin);
        const shopRecharge = {
          ...shopkeeprData,
          recharge: (shopkeeprData.recharge?.wallet || 0) - payments.totalAmount,
        };
        
        await updateUser(shopRecharge);

        // Referral earnings
        if (userData?.parentUserId) {
          const parentData = await getUser(userData.parentUserId, token);
          const referralEarn = totalAmount * smp * 0.02;

          const updatedParent = {
            ...parentData,
            wallet: (parentData.wallet || 0) + referralEarn,
          };
          await updateUser(updatedParent);

          await createNotification({
            userId: parentData.id,
            message: `You earned ₹${referralEarn} from your referral ${userData.userName}'s payment.`,
            earnCoin: referralEarn,
            earnType: "referral",
            earnUserId: userData.id,
            earnUserName: userData.userName,
            status: "sent",
          });
        }
      } else if (status === "rejected") {
        await createNotification({
          userId: user.userId,
          message: `Your payment of ₹${totalAmount} has been rejected.`,
          earnCoin: 0,
          earnType: "payment",
          earnUserId: user.userId,
          earnUserName: userData?.name || "",
          status: "sent",
        });
      }

      // ✅ Update payment record
      const updatedPayment = {
        ...user,
        status,
      };

      await updateProduct(user.userId, updatedPayment);

      alert(`Payment ${status} successfully!`);
      setIsOpen(false);
      fetchPayments();
    } catch (error) {
      console.error("Approval failed:", error);
      alert("Failed to update payment.");
    }
  };


  if (loading) return <p className="text-center text-gray-500 mt-10">Loading payments...</p>;
  if (!payments || payments.length === 0)
    return <p className="text-center text-gray-500 mt-10">No payments found.</p>;

  return (
    <div className="mt-10 max-w-5xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-3">
        {payments.map((obj, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-greens-900 px-4 py-2 text-white flex justify-between items-center">
              <h2 className="font-semibold text-sm">#{i + 1} • {obj.userName}</h2>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${obj.status === "approved" ? "bg-green-200 text-green-900" : "bg-yellow-200 text-yellow-900"}`}>
                {obj.status.toUpperCase()}
              </span>
            </div>
            <div className="px-4 py-3 text-sm text-gray-800 space-y-2">
              <div><strong>Amount:</strong> ₹{obj.totalAmount}</div>
              <div><strong>Earned:</strong> ₹{obj.earnAmount}</div>
              <div><strong>Method:</strong> {obj.paymentMethod}</div>
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

      {/* Dialog */}
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
              <>
                <CustomButton
                  disabled={selectedUser?.totalAmount > 5000}
                  onClick={() => handleApprove(selectedUser, 'rejected')}
                  className={`px-4 py-2 rounded text-white ${selectedUser?.totalAmount > 5000 ? "bg-gray-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"}`}
                >
                  Reject
                </CustomButton>
                <CustomButton
                  disabled={selectedUser?.totalAmount > 5000}
                  onClick={() => handleApprove(selectedUser, 'approved')}
                  className={`px-4 py-2 rounded text-white ${selectedUser?.totalAmount > 5000 ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"}`}
                >
                  Approve
                </CustomButton>
              </>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default Payments;

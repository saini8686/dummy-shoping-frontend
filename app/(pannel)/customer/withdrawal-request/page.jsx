"use client";

import HeaderCustomer from "@/components/customer/HeaderCustomer";
import BottomBarAdmin from '@/components/admin/common/BottomBarAdmin'
import { useState, Suspense, useEffect } from 'react'
import { getAllWithdrawal } from '@/services/transactions.service'
import Cookies from "js-cookie";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

const statusText = {
  pending: "⏳ Pending",
  approved: "✅ Approved",
  rejected: "❌ Rejected"
};

const Page = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const userId = Cookies.get("userId"); // string
    const fetchData = async () => {
      try {
        const withdraw = await getAllWithdrawal();

        // Ensure type match for filtering
        const filtered = withdraw.filter((item) => 
          String(item.userId) === String(userId)
        );

        setTransactions(filtered);
      } catch (err) {
        console.error("Error fetching withdrawals:", err);
      }
    };
    fetchData();
  }, []);

  return (
    <Suspense>
      <HeaderCustomer name="My Withdrawal Requests" />

      <div className="pb-20 mt-8 px-4">
        {transactions.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">💸 No withdrawal requests found.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
            {transactions.map((tx) => (
              <div 
                key={tx.transId} 
                className="p-5 bg-white rounded-2xl shadow-md border hover:shadow-lg transition duration-200"
              >
                {/* Header with User + Status */}
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-lg text-gray-800">
                    {tx.userName}{" "}
                    <span className="text-sm text-gray-500">({tx.userId})</span>
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[tx.status]}`}>
                    {statusText[tx.status]}
                  </span>
                </div>

                {/* Amount Highlight */}
                <div className="text-2xl font-bold text-green-700 mb-3">
                  ₹{tx.transactionAmount}
                </div>

                {/* Details */}
                <div className="space-y-1 text-sm text-gray-600">
                  <p><span className="font-medium">Holder:</span> {tx.receiverName ?? "NA"}</p>
                  <p><span className="font-medium">Acc/UPI:</span> {tx.transactionId}</p>
                  <p><span className="font-medium">IFSC:</span> {tx.mimetype ?? "NA"}</p>
                  <p><span className="font-medium">Payment Type:</span> {tx.paymentType}</p>
                  <p className="text-xs text-gray-500 mt-2">📅 {new Date(tx.createdAt).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomBarAdmin />
    </Suspense>
  );
};

export default Page;

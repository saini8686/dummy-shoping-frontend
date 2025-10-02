"use client";

import HeaderCustomer from "@/components/customer/HeaderCustomer";
import BottomBarAdmin from '@/components/admin/common/BottomBarAdmin'
import { useState, Suspense, useEffect } from 'react'
import { getAllWithdrawal, updateWithdrawal, deleteWithdrawal } from '@/services/transactions.service'
import { getUser, updateUser } from "@/services/users.service";
import Cookies from "js-cookie";

const Page = () => {
    const [transactions, setTransactions] = useState([]);
    const [isUpdated, setUpdated] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const withdraw = await getAllWithdrawal();
                const sorted = withdraw.sort((a, b) => Number(b.transId) - Number(a.transId));

                setTransactions(sorted);
            } catch (err) {
                console.error("Error fetching withdrawals:", err);
            }
        };

        fetchData();
    }, [isUpdated]);

    const handleUpdateStatus = async (id, newStatus) => {
        try {
            // update withdrawal status
            const withdrawal = await updateWithdrawal(id, { status: newStatus });

            setTransactions((prev) =>
                prev.map((w) =>
                    w.transId === id ? { ...w, status: newStatus } : w
                )
            );

            // ✅ If rejected → refund amount back to user
            if (newStatus === "rejected") {
                const token = Cookies.get("token");
                const userInfo = await getUser(withdrawal.userId, token); // fetch user by id
                const refundAmount = withdrawal.transactionAmount || 0;

                await updateUser({
                    ...userInfo,
                    wallet2: Number(userInfo.wallet2 || 0) + Number(refundAmount), // add back money
                });

                console.log(`Refunded ₹${refundAmount} back to user ${withdrawal.userId}`);
            }

            setUpdated(true);
        } catch (err) {
            console.error("Error updating withdrawal:", err);
            alert("Could not update withdrawal");
        }
    };


    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this withdrawal?")) return;

        try {
            await deleteWithdrawal(id);
            setTransactions((prev) =>
                prev.filter((w) => w.transactionId !== id)
            );
            setUpdated(true);
        } catch (err) {
            console.error("Error deleting withdrawal:", err);
            alert("Could not delete withdrawal");
        }
    };

    const statusColors = {
        pending: "bg-yellow-200 text-yellow-800",
        approved: "bg-green-200 text-green-800",
        rejected: "bg-red-200 text-red-800",
    };

    return (
        <Suspense>
            <HeaderCustomer name="Withdrawal Requests" />
            <div className="pb-20 mt-10 px-4">
                <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-300 rounded-lg shadow-sm" style={{ minWidth: "1800px;" }}>
                        <thead className="bg-green-200">
                            <tr>
                                {["ID", "Name", "Holder Name", 'Account/UPI/Paypal Email', "Amount", "IFSC", 'Payment Type', "Status", "Created At", "Actions"].map((title) => (
                                    <th key={title} className="p-3 text-left text-gray-700 font-medium">
                                        {title}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((tx, idx) => (
                                <tr key={tx.transactionId} className={`text-gray-700 ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100`}>
                                    <td className="p-3">{tx.transId}</td>
                                    <td className="p-3">{tx.userName} ({tx.userId})</td>
                                    <td className="p-3">{tx.receiverName ?? 'NA'}</td>
                                    <td className="p-3">{tx.transactionId}</td>
                                    <td className="p-3 font-semibold">₹{tx.transactionAmount}</td>
                                    {/* <td className="p-3">
                                        <a
                                            href={tx.filepath}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 underline hover:text-blue-800"
                                        >
                                            {tx.filename}
                                        </a>
                                    </td> */}
                                    <td className="p-3">{tx.mimetype ?? 'NA'}</td>
                                    <td className="p-3">{tx.paymentType}</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-1 rounded-full text-sm font-semibold ${statusColors[tx.status] || "bg-gray-200 text-gray-800"}`}>
                                            {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                                        </span>
                                    </td>
                                    <td className="p-3">{new Date(tx.createdAt).toLocaleString()}</td>
                                    <td className="p-3 flex gap-2 items-center">
                                        {tx.status === "pending" ? (
                                            <>
                                                <select
                                                    value={tx.status}
                                                    onChange={(e) => handleUpdateStatus(tx.transId, e.target.value)}
                                                    className="border rounded-md px-3 py-1 text-sm font-medium shadow-sm hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="approved">Approve</option>
                                                    <option value="rejected">Reject</option>
                                                </select>

                                                <button
                                                    onClick={() => handleDelete(tx.transId)}
                                                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm font-medium shadow-sm transition"
                                                >
                                                    Delete
                                                </button>
                                            </>
                                        ) : (
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-semibold ${tx.status === "approved"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-700"
                                                    }`}
                                            >
                                                {tx.status === "approved" ? "Approved ✅" : "Rejected ❌"}
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}

                            {transactions.length === 0 && (
                                <tr>
                                    <td colSpan="8" className="p-6 text-center text-gray-500">
                                        No withdrawal requests found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <BottomBarAdmin />
        </Suspense>
    )
}

export default Page;

"use client";
import HeaderCustomer from "@/components/customer/HeaderCustomer";
import Icon from "@/components/common/Icons";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { getAllPayments } from "@/services/payment.service";
import moment from "moment";

const page = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const userId = Number(Cookies.get("userId")); // ensure it's number
    const token = Cookies.get("token");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const payData = await getAllPayments();
                const filtered = (payData ?? [])
                    .filter(item => item.userId === userId)
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setPayments(filtered);
            } catch (error) {
                console.error("Error fetching user data:", error);
                setPayments([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);


    return (
        <div className="bg-white-low">
            <HeaderCustomer name="Recharge status" />
            {loading ? (
                <p className="text-center text-gray-500 text-sm mt-6">Loading...</p>
            ) : payments.length === 0 ? (
                <p className="text-center text-gray-400 text-sm mt-6">
                    No rewards or transactions found.
                </p>
            ) : (
                <div className="pb-20 relative z-[1] mt-8 px-4">
                    {payments.map((payment) => (
                        <div
                            key={payment.id}
                            className="flex justify-between border-b mt-4 pb-2 border-white-100 items-center w-full"
                        >
                            <div className="flex gap-3 items-center">
                                <Icon icon="transitionCome" />
                                <p>
                                    <span className="block text-base !leading-130 font-normal text-greys-1500">
                                        {"Recharge"}
                                    </span>
                                    <span
                                        className={`block text-sm !leading-130 mt-1 font-normal ${payment.status === "approved"
                                            ? "text-green-600"
                                            : payment.status === "pending"
                                                ? "text-yellow-600"
                                                : payment.status === "rejected"
                                                    ? "text-red-600"
                                                    : "text-greys-1400"
                                            }`}
                                    >
                                        <span className="text-black">Status: </span>{`${payment.status}`}
                                    </span>
                                </p>
                            </div>
                            <div className="text-right">
                                <span className="block text-base !leading-130 font-semibold text-greens-900">
                                    ₹ {Number(payment.totalAmount || 0).toFixed(2)}
                                </span>
                                <span className="block text-sm !leading-130 mt-1 font-normal text-greys-1400">
                                    {payment.createdAt
                                        ? moment(payment.createdAt).format("DD MMM YYYY, hh:mm A")
                                        : "N/A"}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default page;

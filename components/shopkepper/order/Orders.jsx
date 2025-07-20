"use client";

import React, { useEffect, useState } from "react";
import Icon from "@/components/common/Icons";
import { getAllPayments } from "@/services/payment.service";
import { getUser } from "@/services/users.service";
import Cookies from "js-cookie";
import moment from "moment"; // Optional: for cleaner date formatting

const Orders = () => {
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [userData, setUserData] = useState(null);
  const [order, setOrder] = useState("all");

  const userId = Cookies.get("userId");
  const token = Cookies.get("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!userId || !token) {
          console.warn("User ID or token not found.");
          return;
        }

        const userDataRes = await getUser(userId, token);
        console.log("User Data:", userDataRes);
        setUserData(userDataRes);

        const payData = await getAllPayments();
        console.log("All Payments:", payData);

        if (payData && userDataRes?.userId) {
          const filteredPayments = payData.filter(
            (item) => String(item.userId) === String(userDataRes.userId)
          );
          setRecentTransactions(filteredPayments);
        } else {
          console.warn("Missing payment data or userId for filtering.");
          setRecentTransactions([]);
        }
      } catch (error) {
        console.error("Error fetching user data or payments:", error);
      }
    };

    fetchData();
  }, [userId, token]);

  const filteredOrders = recentTransactions.filter((obj) => {
    if (!order || order === "all") return true;
    return obj.status?.toLowerCase().replace(/ /g, "-") === order;
  });

  return (
    <div className="mt-10">
      {filteredOrders.map((obj, i) => (
        <div
          key={i}
          className="flex mt-6 pb-2.5 border-b border-white-100 justify-between items-center"
        >
          <div>
            <p>
              <span className="font-medium block text-sm !leading-130 text-greys-1500">
                Order ID {obj.payId}
              </span>
              <span className="font-normal block text-sm !leading-130 text-greys-1400">
                {moment(obj.createdAt).format("MMM DD, YYYY hh:mm A")}
              </span>
            </p>
          </div>

          {!order || order === "all" ? (
            <p
              className={`py-1 px-2.5 text-sm font-medium !leading-130 
              ${
                obj.status === "New Order"
                  ? "bg-greens-900 text-[#B9FFDD]"
                  : obj.status === "Awaiting Pickup"
                  ? "bg-[#FFA500]/20 text-[#FFA500]"
                  : obj.status === "pending"
                  ? "bg-[#0754EA]/20 text-[#0754EA]"
                  : obj.status === "Complete"
                  ? "bg-[#EAFFEA] text-[#324E32]"
                  : obj.status === "Cancelled"
                  ? "bg-reds-900/20 text-reds-900"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {obj.status}
            </p>
          ) : (
            <div className="flex items-center gap-1">
              <p className="text-sm font-normal text-greys-1400 !leading-130">
                {obj.item} items
              </p>
              <Icon icon="arrowNext" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Orders;

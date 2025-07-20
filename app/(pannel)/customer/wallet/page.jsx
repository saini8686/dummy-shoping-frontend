"use client";

import HeaderCustomer from "@/components/customer/HeaderCustomer";
import BottomBarShopKepper from "@/components/shopkepper/common/BottomBarShopKepper";
import RecentTransition from "@/components/shopkepper/wallet/RecentTransition";
import TotalAmount from "@/components/shopkepper/wallet/TotalAmount";
import { useEffect, useState } from "react";
import { getUser } from "@/services/users.service";
import { getAllPayments } from "@/services/payment.service";
import Cookies from "js-cookie";

const Page = () => {
  const [totalAmount, setTotalAmount] = useState(null);
  const [recentTransactions, setRecentTransactions] = useState([]);

  const userId = Cookies.get("userId");
  const token = Cookies.get("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await getUser(userId, token);
        console.log("User Data:", userData);
        setTotalAmount(userData);

        const payData = await getAllPayments();
        console.log("All Payments:", payData);

        if (payData && userData?.userId) {
          const filteredPayments = payData.filter(
            item => String(item.userId) === String(userData.userId)
          );
          console.log("Filtered Payments:", filteredPayments);
          setRecentTransactions(filteredPayments);
        } else {
          console.warn("Missing payment data or userId for filtering.");
          setRecentTransactions([]);
        }

      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-white-low">
      <HeaderCustomer name="Wallet" />
      <div className="pb-20 mt-10 px-4">
        <TotalAmount total={totalAmount} />
        <RecentTransition transactions={recentTransactions} />
        <BottomBarShopKepper />
      </div>
    </div>
  );
};

export default Page;

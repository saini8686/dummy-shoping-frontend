"use client";

import HeaderCustomer from "@/components/customer/HeaderCustomer";
import BottomBarShopKepper from "@/components/shopkepper/common/BottomBarShopKepper";
import RecentTransition from "@/components/shopkepper/wallet/RecentTransition";
import TotalAmount from "@/components/shopkepper/wallet/TotalAmount";
import { useEffect, useState } from "react";
import { getAllUserList } from "@/services/users.service";
import { getAllPayments } from "@/services/payment.service";
import Cookies from "js-cookie";
import BottomBarAdmin from "@/components/admin/common/BottomBarAdmin";

const Page = () => {
  const [totalAmount, setTotalAmount] = useState(0);
  const [recentTransactions, setRecentTransactions] = useState([]);

  const userId = Cookies.get("userId");
  const token = Cookies.get("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get all users
        const userData = await getAllUserList();

        console.log("All Users Data:", userData);
        if (Array.isArray(userData)) {
          const totalWalletAmount = userData.reduce((total, user) => {
            const walletValue = parseFloat(user.wallet) || 0;
            return total + walletValue;
          }, 0);

          console.log("💰 Total Wallet Value (Admin View): ₹", totalWalletAmount);
          setTotalAmount(totalWalletAmount);
        } else {
          console.warn("userData is not an array.");
          setTotalAmount(0);
        }

        // Get all payment transactions
        const payData = await getAllPayments();
        console.log("All Payments:", payData);
        setRecentTransactions(payData);

      } catch (error) {
        console.error("Error fetching data:", error);
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
        <BottomBarAdmin />
      </div>
    </div>
  );
};

export default Page;

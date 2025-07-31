"use client";

import HeaderCustomer from "@/components/customer/HeaderCustomer";
import BottomBarAdmin from "@/components/admin/common/BottomBarAdmin";
import RecentTransition from "@/components/shopkepper/wallet/RecentTransition";
import TotalAmount from "@/components/shopkepper/wallet/TotalAmount";
import { useEffect, useState } from "react";
import { getAllUserList } from "@/services/users.service";
import { getAllPayments } from "@/services/payment.service";
import { getAllNotifications } from "@/services/notification.service"
import Cookies from "js-cookie";

const Page = () => {
  const [totalAmount, setTotalAmount] = useState(0);
  const [breakdown, setBreakdown] = useState({
    wallet: 0,
    wallet1: 0,
    wallet2: 0,
  });
  const [recentTransactions, setRecentTransactions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await getAllUserList();

        if (Array.isArray(userData)) {
          let wallet = 0, wallet1 = 0, wallet2 = 0;

          userData.forEach((user) => {
            wallet += parseFloat(user.wallet) || 0;
            wallet1 += parseFloat(user.wallet1) || 0;
            wallet2 += parseFloat(user.wallet2) || 0;
          });

          setBreakdown({ wallet, wallet1, wallet2 });
          setTotalAmount(wallet + wallet1 + wallet2);
        } else {
          setBreakdown({ wallet: 0, wallet1: 0, wallet2: 0 });
          setTotalAmount(0);
        }

        const payData = await getAllNotifications ();
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
        <TotalAmount total={totalAmount} isAdmin={true} breakdown={breakdown} />
        <RecentTransition transactions={recentTransactions} />
        <BottomBarAdmin />
      </div>
    </div>
  );
};

export default Page;

"use client";

import HeaderCustomer from "@/components/customer/HeaderCustomer";
import BottomBarAdmin from "@/components/admin/common/BottomBarAdmin";
import RecentTransition from "@/components/shopkepper/wallet/RecentTransition";
import TotalAmount from "@/components/shopkepper/wallet/TotalAmount";
import { useEffect, useState } from "react";
import { getAllUserList } from "@/services/users.service";
import { getAllNotifications } from "@/services/notification.service";

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
        const users = await getAllUserList();
        const admin = users.find((u) => u.isAdmin === true);

        if (admin) {
          let wallet1 = 0;
          let wallet2 = 0;

          users.forEach((user) => {
            wallet1 += parseFloat(user.wallet1) || 0;
            wallet2 += parseFloat(user.wallet2) || 0;
          });

          setBreakdown({
            wallet: parseFloat(admin.wallet) || 0,
            wallet1: parseFloat(admin.wallet1) || 0,
            wallet2: parseFloat(admin.wallet2) || 0,
          });

          setTotalAmount(wallet1 + wallet2 + (parseFloat(admin.wallet) || 0));
        }

        const notifResponse = await getAllNotifications();
        const filterData = notifResponse?.data.filter(item => item.earnType === "company1" && item.earnType === "company2" && item.earnType === "recharge") || []
        setRecentTransactions(filterData);
      } catch (error) {
        console.error("Error loading wallet data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-white-low">
      <HeaderCustomer name="Wallet" />
      <div className="pb-20 mt-10 px-4">
        <TotalAmount
          total={totalAmount}
          isAdmin={true}
          isShopkeeper={false}
          breakdown={breakdown}
        />
        <RecentTransition
          transactions={recentTransactions}
          isShopkeeper={false}
        />
        <BottomBarAdmin />
      </div>
    </div>
  );
};

export default Page;

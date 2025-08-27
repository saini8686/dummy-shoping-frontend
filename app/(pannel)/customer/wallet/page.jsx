"use client";

import HeaderCustomer from "@/components/customer/HeaderCustomer";
import BottomBarShopKepper from "@/components/shopkepper/common/BottomBarShopKepper";
import RecentTransition from "@/components/shopkepper/wallet/RecentTransition";
import TotalAmount from "@/components/shopkepper/wallet/TotalAmount";
import { useEffect, useState } from "react";
import { getUserById } from "@/services/users.service";
import { getAllNotifications } from "@/services/notification.service";
import Cookies from "js-cookie";
import BottomBar from "@/components/common/BottomBar";

const Page = () => {
  const [totalAmount, setTotalAmount] = useState(null);
  const [recentTransactions, setRecentTransactions] = useState([]);

  const userId = Cookies.get("userId");
  const token = Cookies.get("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await getUserById(userId, token);
        setTotalAmount(userData);

        const payData = await getAllNotifications();

        if (payData.success) {
          const userIdStr = String(userId);

          // Step 1: Get all transactions related to the user (either made by or earned by)
          const userPayments = payData.data.filter(
            item =>
              String(item.userId) === userIdStr &&
              item.earnType !== "company1" && item.earnType !== "company2"
          );

          // Step 2: Filter transactions earned from others (earnUserId is user, but someone else paid)
          // const earnedFromOthers = userPayments.filter(
          //   item =>
          //     String(item.earnUserId) !== userIdStr &&
          //     String(item.userId) === userIdStr
          // );

          // console.log(earnedFromOthers);


          // Step 3: Filter userPayments to remove items that are in earnedFromOthers
          // const onlyUserPayments = userPayments.filter(
          //   item =>
          //     !earnedFromOthers.some(
          //       earn =>
          //         String(earn.userId) === String(item.userId) &&
          //         String(earn.earnUserId) === String(item.earnUserId) &&
          //         String(earn.createdAt) === String(item.createdAt) // optional: use id if available
          //     )
          // );

          // console.log("onlyUserPayments", onlyUserPayments);
          // console.log("earnedFromOthers", earnedFromOthers);

          // // Combine both separately filtered sets (if needed)
          // const filteredPayments = [...onlyUserPayments, ...earnedFromOthers];
          // console.log("Filtered Payments:", filteredPayments);

          setRecentTransactions(userPayments);

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
        <TotalAmount total={totalAmount} isAdmin={false} isShopkeeper={false} breakdown={""} />
        <RecentTransition transactions={recentTransactions} isShopkeeper={false} />
        <BottomBar />
      </div>
    </div>
  );
};

export default Page;

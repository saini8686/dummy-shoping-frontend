"use client";
import Icon from "@/components/common/Icons";
import SearchBar from "@/components/common/SearchBar";
import BottomBarShopKepper from "@/components/shopkepper/common/BottomBarShopKepper";
import Orders from "@/components/shopkepper/order/Orders";
import OrderTabList from "@/components/shopkepper/order/OrderTabList";
import NavbarShopkepper from "@/components/shopkepper/product/NavbarShopkepper";
import ProductIn from "@/components/shopkepper/product/ProductIn";
import Link from "next/link";
import { Suspense } from "react";

import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import { getUser } from "@/services/users.service";



const page = () => {
  const userId = Cookies.get("userId");
  const token = Cookies.get("token");

  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await getUser(userId, token);
        console.log("User Data:", userData);
        setUserInfo(userData);

      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Suspense>
      {" "}
      <div className="bg-white-low">
        <NavbarShopkepper userInfo={userInfo} />
        <div className="pb-20 relative z-[1] mt-8 px-4">
          <SearchBar />
          <OrderTabList />
          <Orders />
          <BottomBarShopKepper />
        </div>
      </div>
    </Suspense>
  );
};

export default page;

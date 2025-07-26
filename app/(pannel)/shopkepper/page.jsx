"use client";
import HeaderCustomer from "@/components/customer/HeaderCustomer";
import BasicDetailForm from "@/components/shopkepper/detail/BasicDetailForm";

import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import { getUser } from "@/services/users.service";
import SearchBar from "@/components/common/SearchBar";
import BottomBarShopKepper from "@/components/shopkepper/common/BottomBarShopKepper";
import Orders from "@/components/shopkepper/order/Orders";
import OrderTabList from "@/components/shopkepper/order/OrderTabList";
import Navbar from "@/components/common/Navbar";
import NavbarShopkepper from "@/components/shopkepper/product/NavbarShopkepper";

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
    <div className="bg-white-low">
      {/* <HeaderCustomer userInfo={userInfo} /> */}
      {/* <HeaderCustomer name="Order" /> */}
      <NavbarShopkepper userInfo={userInfo}  />
      <div className="pb-20 relative z-[1] mt-8 px-4">
        <SearchBar />
        <OrderTabList />
        <Orders />
        <BottomBarShopKepper />
      </div>
      {/* <HeaderCustomer userInfo={userInfo} />
      <div className="pb-20 mt-10 px-4">
        <BasicDetailForm />
      </div> */}
    </div>
  );
};

export default page;

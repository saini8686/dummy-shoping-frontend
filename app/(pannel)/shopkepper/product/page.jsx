"use client";
import Icon from "@/components/common/Icons";
import SearchBar from "@/components/common/SearchBar";
import BottomBarShopKepper from "@/components/shopkepper/common/BottomBarShopKepper";
import NavbarShopkepper from "@/components/shopkepper/product/NavbarShopkepper";
import ProductIn from "@/components/shopkepper/product/ProductIn";
import HeaderCustomer from "@/components/customer/HeaderCustomer";
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
    <div className="bg-white-low">
      <NavbarShopkepper userInfo={userInfo} />
      <div className="pb-20 relative z-[1] mt-8 px-4">
        <SearchBar />
        <ProductIn />
        <BottomBarShopKepper />
        <div className="fixed left-1/2 max-w-[540px] pr-3 w-full mx-auto flex ml-auto justify-end  -translate-x-1/2 bottom-20">
          <Link
            href="/shopkepper/product/add-product"
            className="w-[60px]   h-[60px] text-[#228B22] hover:text-white duration-300 hover:bg-[#228B22] hover:border-transparent rounded-full flex justify-center items-center bg-[#FBFEFB] border-white-100 border-2"
          >
            <Icon icon="plusGreen" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default page;

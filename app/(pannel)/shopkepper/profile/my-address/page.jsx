"use client";
import HeaderCustomer from "@/components/customer/HeaderCustomer";
import MyAddress from "@/components/customer/profile/MyAddress";
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
      <HeaderCustomer name="My Addresse" />
      <div className="pb-20 mt-9 px-4">
        <MyAddress userInfo={userInfo} />
      </div>
    </div>
  );
};

export default page;

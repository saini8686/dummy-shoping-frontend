"use client";

import { useState, useEffect } from "react";
import BottomBar from "@/components/common/BottomBar";
import SearchBar from "@/components/common/SearchBar";
import Navbar from "@/components/common/Navbar";
import NearByShare from "@/components/customer/nearby-share/NearByShare";
import Cookies from "js-cookie";
import { getUserById } from "@/services/users.service";

const Page = () => {
  const userId = Cookies.get("userId");
  const token = Cookies.get("token");

  const [userInfo, setUserInfo] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await getUserById(userId, token);
        console.log("User Data:", userData);
        setUserInfo(userData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (userId && token) {
      fetchData();
    }
  }, [userId, token]);

  return (
    <div className="bg-white-low">
      <Navbar userInfo={userInfo} />
      <div className="pb-20 px-4">
        <SearchBar search={search} setSearch={setSearch} />
        <NearByShare search={search} />
      </div>
      <BottomBar />
    </div>
  );
};

export default Page;

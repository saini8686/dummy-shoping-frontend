"use client";
import React, { useState, useEffect } from "react";
import Icon from "../common/Icons";
import { CustomButton } from "../common/CustomButton";
import { useRouter, useSearchParams } from "next/navigation";
import { getUser, updateUser } from "../../services/users.service";
import Image from "next/image";
import Cookies from "js-cookie";

const UserDetails = () => {
  const searchParams = useSearchParams();
  const userId = searchParams.get("id");
  const token = Cookies.get("token");
  const router = useRouter();

  const [userData, setUserData] = useState(null);
  const [rechargeModalOpen, setRechargeModalOpen] = useState(false);
  const [newRecharge, setNewRecharge] = useState("");

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const data = await getUser(userId, token);
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, [userId, token]);

  const handleRechargeUpdate = async () => {
    if (!userData) return;
    const updatedUser = { ...userData, recharge: (userData.recharge || 0) + parseFloat(newRecharge) };

    try {
      await updateUser(updatedUser);
      setUserData(updatedUser);
      setRechargeModalOpen(false);
    } catch (error) {
      console.error("Recharge update failed:", error);
    }
  };

  if (!userData) return <p>Loading...</p>;

  return (
    <div className="w-full h-screen bg-white rounded-xl shadow-md">
      {/* Header */}
      <div className="bg-[#01BA5D] text-white p-4 rounded-b-3xl relative">
        <button onClick={() => router.back()} className="mt-12 bg-transparent">
          <Icon icon="back" className="invert" />
        </button>
        <h2 className="text-2xl mt-[50px] mb-2 font-semibold font-roboto text-white">
          User Details
        </h2>
      </div>

      {/* User Info */}
      <div className="py-9 px-4">
        <div className="bg-white border border-[#DCDCDC] rounded-xl px-3 py-4 flex gap-5">
          <div className="w-[80px] h-[80px]">
            <img
              src={userData?.profilePicture ? `${process.env.NEXT_PUBLIC_API_BASE?.replace(/\/$/, "")}/${userData?.profilePicture}` : "/assets/images/png/shopkepper/basic-detail-profile.png"}
              width={80}
              height={80}
              alt="Profile"
              className="rounded-full object-cover"
            />
          </div>
          <div className="flex-1">
            <h3 className="text-[#01BE62] font-bold mb-2">User #{userData.userId}</h3>
            <p className="text-sm text-[#575757]">Name: {userData.name}</p>
            <p className="text-sm text-[#575757]">Email: {userData.email}</p>
            <p className="text-sm text-[#575757]">Mobile: {userData.number}</p>
            <p className="text-sm text-[#575757]">Status: {userData.status}</p>
            <p className="text-sm text-[#575757]">
              Recharge: ₹{userData.recharge}
              <button
                onClick={() => {
                  setRechargeModalOpen(true);
                  setNewRecharge(userData.recharge);
                }}
                className="ml-3 text-blue-600 underline text-xs"
              >
                Update
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Shop Images */}
      <div className="px-4 mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
        {["shop_front_url", "shop_counter_url", "other_img_url"].map((imgKey, i) =>
          userData[imgKey] ? (
            <img
              key={i}
              src={userData?.profilePicture ? `${process.env.NEXT_PUBLIC_API_BASE?.replace(/\/$/, "")}/${userData[imgKey]}` : "/assets/images/png/shopkepper/basic-detail-profile.png"}
              alt={imgKey}
              width={200}
              height={150}
              className="rounded-lg border object-cover"
            />
          ) : null
        )}
      </div>

      {/* Recharge Modal */}
      {rechargeModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-96">
            <h3 className="text-xl font-semibold mb-4">Update Recharge</h3>
            <input
              type="number"
              value={newRecharge}
              onChange={(e) => setNewRecharge(e.target.value)}
              className="w-full border px-3 py-2 rounded mb-4"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setRechargeModalOpen(false)}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleRechargeUpdate}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDetails;

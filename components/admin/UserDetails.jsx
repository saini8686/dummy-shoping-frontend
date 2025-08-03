"use client";
import React, { useState, useEffect } from "react";
import Icon from "../common/Icons";
import { useRouter, useSearchParams } from "next/navigation";
import { getUser, updateUser } from "../../services/users.service";
import Image from "next/image";
import Cookies from "js-cookie";

const UserDetails = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("id");
  const token = Cookies.get("token");

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

    if (userId && token) {
      fetchUserDetails();
    }
  }, [userId, token]);

  const handleRechargeUpdate = async () => {
    if (!userData) return;
    const updatedUser = {
      ...userData,
      recharge: (userData.recharge || 0) + parseFloat(newRecharge),
    };

    try {
      await updateUser(updatedUser);
      setUserData(updatedUser);
      setRechargeModalOpen(false);
    } catch (error) {
      console.error("Recharge update failed:", error);
    }
  };

  if (!userData) return <p className="text-center mt-10">Loading...</p>;

  const profileSrc = userData.profilePicture
    ? `${process.env.NEXT_PUBLIC_API_BASE?.replace(/\/$/, "")}/${userData.profilePicture}`
    : "/assets/images/png/shopkepper/basic-detail-profile.png";

  const shopImages = ["shop_front_url", "shop_counter_url", "other_img_url"];

  return (
    <div className="w-full min-h-screen bg-white rounded-xl shadow-md">
      {/* Header */}
      <div className="bg-[#01BA5D] text-white px-4 py-6 rounded-b-3xl relative">
        <button onClick={() => router.back()} className="absolute top-4 left-4">
          <Icon icon="back" className="invert" />
        </button>
        <h2 className="text-2xl font-semibold text-center mt-8">User Details</h2>
      </div>

      {/* User Info */}
      <div className="py-8 px-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4 flex gap-6 items-center">
          <img
            src={profileSrc}
            width={80}
            height={80}
            alt="Profile"
            className="rounded-full object-cover w-20 h-20"
          />
          <div>
            <h3 className="text-[#01BE62] font-bold mb-1">User #{userData.userId}</h3>
            <p className="text-sm text-gray-700">Name: {userData.name}</p>
            <p className="text-sm text-gray-700">Email: {userData.email}</p>
            <p className="text-sm text-gray-700">Mobile: {userData.number}</p>
            <p className="text-sm text-gray-700">Status: {userData.status}</p>
            <p className="text-sm text-gray-700 mt-1">
              Recharge: {userData.recharge || 0}
              <button
                onClick={() => {
                  setRechargeModalOpen(true);
                  setNewRecharge("");
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
      <div className="px-4 grid grid-cols-2 md:grid-cols-3 gap-4 mb-10 pb-10">
        {shopImages.map((key) =>
          userData[key] ? (
            <img
              key={key}
              src={`${process.env.NEXT_PUBLIC_API_BASE?.replace(/\/$/, "")}/${userData[key]}`}
              alt={key}
              className="rounded-lg border object-cover w-full h-48"
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
              placeholder="Enter amount"
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
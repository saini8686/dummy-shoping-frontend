"use client";
import React, { useState, useEffect } from "react";
import { Pencil, Trash2, User, View } from "lucide-react";
import Icon from "@/components/common/Icons";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getAllUserList, deleteUser } from "../../services/users.service";

const UsersList = () => {
  const router = useRouter();
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const data = await getAllUserList();
        const filterData = data.filter(
          (item) => item.isShopkeeper === false && item.isAdmin === false
        );
        setUserData(filterData);
      } catch (error) {
        console.error("Error fetching user details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  const handleDeleteUser = async (userId) => {
    const confirmDelete = confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    try {
      // TODO: Call API to delete user
      // await deleteUser(userId);
      setUserData((prev) => prev.filter((user) => user.userId !== userId));
      deleteUser(userId);
      alert("User deleted successfully.");
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete user.");
    }
  };

  return (
    <div className="h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-md h-full w-full flex flex-col relative">
        {/* Header */}
        <div className="pt-8 pb-4 rounded-b-3xl bg-greens-900 px-4 relative">
          <div className="flex justify-between items-center">
            <button
              onClick={() => router.back()}
              className="border-0 outline-0 bg-transparent"
            >
              <Icon icon="back" className="invert" />
            </button>
            <Link href="/customer">
              <Image
                src="/assets/images/svg/logo.svg"
                width={100}
                height={39}
                className="object-cover"
                alt="logo"
              />
            </Link>
          </div>
          <div className="flex justify-between gap-5 mt-7 items-center">
            <div className="flex items-center gap-2">
              <Image
                src="/assets/images/png/shopkepper/basic-detail-profile.png"
                width={51}
                height={51}
                className="w-[51px] h-[51px] object-cover rounded-full"
                alt="profile"
              />
              <p className="text-white font-medium block text-base">
                <span>Hello Admin</span>
                <span className="text-sm text-white/70 mt-0.5 block">
                  Let’s make sales today
                </span>
              </p>
            </div>
            <Link
              href="/shopkepper/notification"
              className="bg-white flex rounded-full justify-center items-center min-w-[34px] h-[34px]"
            >
              <Icon icon="notification" />
            </Link>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 flex flex-col overflow-hidden px-4">
          <div className="flex justify-between py-5 text-sm text-[#01BE62] font-medium">
            <p className="text-xl font-normal">
              No. Of Users: <span>{userData.length}</span>
            </p>
            <p className="text-xl font-normal">Locations: <span>200</span></p>
          </div>

          <h3 className="mb-7 text-2xl font-bold text-black">Users List</h3>

          {!loading && (
            <div className="overflow-y-auto flex-1 pb-16 user-list">
              {userData.map((user) => (
                <div
                  key={user.userId}
                  className="flex items-center justify-between bg-[#F1FFF8] p-4 rounded-lg mb-3"
                >
                  <div className="flex items-center">
                    <button
                      className="bg-white rounded-full me-6"
                      onClick={() => {
                        setSelectedUser(user);
                        setShowModal(true);
                      }}
                    >
                      <Icon icon="userProfile" />
                    </button>
                    <div>
                      <h4 className="text-[#01BE62] text-base font-bold mb-2">
                        {user?.name}
                      </h4>
                      <p className="text-[#858585] text-xs">{user?.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6">
                    <View
                      onClick={() => {
                        setSelectedUser(user);
                        setShowModal(true);
                      }}
                      className="w-6 h-6 text-[#01BA5D] cursor-pointer"
                    />
                    <Trash2
                      onClick={() => handleDeleteUser(user.userId)}
                      className="w-6 h-6 text-red-500 cursor-pointer"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {loading && <p>Loading...</p>}
        </div>

        {/* User Details Popup */}
        {showModal && selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white p-6 rounded-xl w-[90%] max-w-md relative">
              <button
                className="absolute top-2 right-2 text-gray-500"
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
              <h2 className="text-xl font-bold text-[#01BA5D] mb-4">User Details</h2>
              <p><strong>Name:</strong> {selectedUser.name}</p>
              <p><strong>Email:</strong> {selectedUser.email}</p>
              <p><strong>Mobile:</strong> {selectedUser.number}</p>
              <p><strong>Status:</strong> {selectedUser.status}</p>
              <p><strong>Referral Code:</strong> {selectedUser.referralCode}</p>
              
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersList;

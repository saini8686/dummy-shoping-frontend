"use client";
import React, { useState, useEffect } from "react";
import { Trash2, View } from "lucide-react";
import Icon from "@/components/common/Icons";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ToastContainer, toast } from "react-toastify";
import { getAllUserList, deleteUser } from "@/services/users.service";

const Top10UsersList = () => {
  const router = useRouter();
  const [userData, setUserData] = useState([]);
  const [adminData, setAdminData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const data = await getAllUserList();

        // ✅ exclude admins & shopkeppers
        const filtered = data.filter(item => !item.isshopkepper && !item.isAdmin);

        // ✅ sort customers by wallet balance (descending) and take only top 10
        const top10 = filtered
          .sort((a, b) => (b.wallet || 0) - (a.wallet || 0))
          .slice(0, 10);

        const findAdmin = data.find(item => item.isAdmin === true);

        setAdminData(findAdmin);
        setUserData(top10);
      } catch (error) {
        console.error("Error fetching user details:", error);
        toast.error("Failed to fetch user data.");
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
      await deleteUser(userId);
      setUserData((prev) => prev.filter((user) => user.userId !== userId));
      toast.success("User deleted successfully.");
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Failed to delete user.");
    }
  };

  return (
    <div className="h-screen bg-gray-100 flex items-center justify-center">
      <ToastContainer />
      <div className="bg-white rounded-xl shadow-md h-full w-full flex flex-col relative">
        {/* Body */}
        <div className="flex-1 flex flex-col overflow-hidden px-4">

          <h3 className="mb-7 text-2xl font-bold text-black mt-5">User List</h3>

          {!loading ? (
            <div className="overflow-y-auto flex-1 pb-16 user-list">
              {userData.map((user) => (
                <div
                  key={user.userId}
                  className="flex items-center justify-between bg-[#F1FFF8] p-4 rounded-lg mb-3"
                >
                  <div className="flex items-center">
                    <button
                      className="bg-white rounded-full me-6"
                    >
                      <Icon icon="userProfile" />
                    </button>
                    <div>
                      <h4 className="text-[#01BE62] text-base font-bold mb-2">
                        {user?.name}
                      </h4>
                      <p className="text-[#858585] text-xs">Email: {user?.email}</p>
                      <p className="text-[#858585] text-xs">Total Earning SMP: {user?.wallet + user?.wallet2}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-sm text-gray-400 mt-4">Loading users...</p>
          )}
        </div>

        {/* User Details Modal */}
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
              <p><strong>Referral Code:</strong> {selectedUser.referralCode}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Top10UsersList;

"use client";
import React, { useState, useEffect } from "react";
import { Pencil, Trash2, View } from "lucide-react";
import Icon from "@/components/common/Icons";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ToastContainer, toast } from "react-toastify";
import { getAllUserList, updateUser, deleteUser } from "../../services/users.service";

const ShopsList = () => {
  const router = useRouter();
  const [userData, setUserData] = useState([]);
  const [adminData, setAdminData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState("");

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const data = await getAllUserList();
        const filtered = data.filter(
          (item) => item.isShopkeeper === true && item.isAdmin === false
        );
        const findAdmin = data.find(item => item.isAdmin = true);
        setAdminData(findAdmin)
        setUserData(filtered);
      } catch (error) {
        toast.error("Failed to fetch users.");
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  const handleStatusUpdate = async () => {
    if (!selectedUser) return;

    try {
      const updatedUser = { ...selectedUser, status: newStatus };
      await updateUser(updatedUser);

      setUserData((prev) =>
        prev.map((user) =>
          user.userId === updatedUser.userId ? updatedUser : user
        )
      );

      toast.success(`Status updated to "${newStatus}"`);
      setShowStatusModal(false);
      setSelectedUser(null);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status.");
    }
  };

  const handleDeleteUser = async (userId) => {
    toast((t) => (
      <div>
        <p>Confirm delete?</p>
        <div className="flex gap-2 mt-2">
          <button
            onClick={async () => {
              try {
                await deleteUser(userId);
                setUserData((prev) => prev.filter((u) => u.userId !== userId));
                toast.success("User deleted.");
              } catch (err) {
                console.error("Delete failed:", err);
                toast.error("Delete failed.");
              }
              toast.dismiss(t.id);
            }}
            className="text-white bg-red-600 px-3 py-1 rounded text-sm"
          >
            Yes
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="text-sm bg-gray-200 px-3 py-1 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    ));
  };

  return (
    <div className="h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-md h-full w-full flex flex-col relative">
        {/* Header */}
        <ToastContainer />
        <div className="pt-8 pb-4 rounded-b-3xl bg-greens-900 px-4 relative">
          <div className="flex justify-between items-center">
            <button
              onClick={() => router.back()}
              className="border-0 outline-0 bg-transparent"
            >
              <Icon icon="back" className="invert" />
            </button>
            <Link href="/admin/shop-list">
              <Image
                src="/assets/images/svg/logo.svg"
                width={100}
                height={39}
                alt="logo"
              />
            </Link>
          </div>
          <div className="flex justify-between gap-5 mt-7 items-center">
            <div className="flex items-center gap-2">
              <img
                src={adminData?.profilePicture ? `${process.env.NEXT_PUBLIC_API_BASE?.replace(/\/$/, "")}/${adminData?.profilePicture}` : "/assets/images/png/shopkepper/basic-detail-profile.png"}
                width={51}
                height={51}
                alt="profile"
                className="w-[51px] h-[51px] object-cover rounded-full"
              />
              <p className="text-white font-medium block text-base">
                <span>Hello {adminData.name || "Admin"}</span>
                <span className="text-sm text-white/70 mt-0.5 block">
                  Let’s make sales today
                </span>
              </p>
            </div>
            <Link
              href="#"
              // href="/shopkepper/notification"
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

          <h3 className="mb-7 text-2xl font-bold text-black">Shops List</h3>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="overflow-y-auto flex-1 pb-16 user-list">
              {userData.map((user) => (
                <div
                  key={user.userId}
                  className="flex items-center justify-between bg-[#F1FFF8] p-4 rounded-lg mb-3"
                >
                  <div className="flex items-center">
                    <Link
                      href={`/admin/user-details?id=${user.userId}`}
                      className="bg-white rounded-full me-6"
                    >
                      <Icon icon="userProfile" />
                    </Link>
                    <Link href={`/admin/user-details?id=${user.userId}`}>
                      <h4 className="text-[#01BE62] text-base font-bold mb-2">
                        {user?.name}
                      </h4>
                      <p className="text-[#858585] text-xs">{user?.email}</p>
                      <span
                        className={`inline-block mt-1 text-xs font-medium px-2 py-1 rounded-full ${user.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : user.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                          }`}
                      >
                        {user.status}
                      </span>
                    </Link>
                  </div>
                  <div className="flex items-center space-x-6">
                    <Link href={`/admin/user-details?id=${user.userId}`}>
                      <View className="w-6 h-6 text-[#01BA5D] cursor-pointer" />
                    </Link>
                    <Pencil
                      className="w-6 h-6 text-[#01BA5D] cursor-pointer"
                      onClick={() => {
                        setSelectedUser(user);
                        setNewStatus(user.status);
                        setShowStatusModal(true);
                      }}
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
        </div>
      </div>

      {/* Modal */}
      {showStatusModal && selectedUser && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-xl p-6 w-96">
            <h3 className="text-xl font-bold mb-4">
              Update Status for {selectedUser.name}
            </h3>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full border rounded px-3 py-2 mb-4"
            >
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowStatusModal(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleStatusUpdate}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopsList;

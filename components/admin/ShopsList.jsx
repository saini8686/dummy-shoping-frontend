"use client";
import React from "react";
import { Pencil, Trash2, User, View } from "lucide-react";
import Icon from "@/components/common/Icons";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getAllUserList } from "../../services/users.service"
import { useState, useEffect } from "react";
import Image from "next/image";

const ShopsList = () => {
  const router = useRouter();
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState("");

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const data = await getAllUserList();
        console.log(data, 'All user details data');
        const filterData = data.filter((item) => item.isShopkeeper === true && item.isAdmin === false)
        setUserData(filterData);
      } catch (error) {
        console.error('Error fetching user details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  const handleStatusUpdate = () => {
    if (!selectedUser) return;

    // TODO: Replace this with an API call to update status
    console.log(`Updating status for ${selectedUser.name} to ${newStatus}`);

    // Example: update the user list locally
    const updatedUsers = userData.map(user =>
      user.userId === selectedUser.userId ? { ...user, status: newStatus } : user
    );
    setUserData(updatedUsers);

    setShowStatusModal(false);
    setSelectedUser(null);
  };


  // if (loading) return <p>Loading...</p>;
  return (
    <div className="h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-md h-full w-full flex flex-col relative">
        {/* Green Panel Header */}
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
                width={86}
                height={39}
                sizes="100vw"
                className="w-[85px] h-[32px] object-cover"
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
                sizes="100vw"
                className="w-[51px] h-[51px] object-cover"
                alt="logo"
              />
              <p className="text-white font-medium block text-base !leading-130">
                <span className="block">Hello Admin</span>
                <span className="block text-sm text-white/70 mt-0.5">
                  Let’s make sales today
                </span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/shopkepper/notification"
                className="bg-white flex rounded-full justify-center items-center min-w-[34px] h-[34px]"
              >
                <Icon icon="notification" />
              </Link>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col overflow-hidden px-4">
          {/* Stats */}
          <div className="flex justify-between py-5 text-sm text-[#01BE62] font-medium">
            <p className="text-xl font-normal">
              No. Of Users: <span>{userData.length}</span>
            </p>
            <p className="text-xl font-normal">
              Locations: <span>200</span>
            </p>
          </div>

          {/* Fixed Heading */}
          <h3 className="mb-7 text-2xl font-bold text-black !leading-130">
            Shops List
          </h3>

          {/* Scrollable List */}
          {!loading && <div className="overflow-y-auto flex-1 pb-16 user-list">
            {userData.map((user) => (
              <div
                key={user.userId}
                className="flex items-center justify-between bg-[#F1FFF8] p-4 rounded-lg mb-3"
              >
                <div className="flex items-center">
                  <Link
                    href={`/admin/user-details`}
                    className="bg-white rounded-full me-6"
                  >
                    <Icon icon="userProfile" />
                  </Link>
                  <Link
                    href={`/admin/user-details/`}>
                    <h4 className="text-[#01BE62] text-base font-bold !leading-130 mb-2">
                      {user?.name}
                    </h4>
                    <p className="text-[#858585] text-xs">{user?.email}</p>
                    <span
                      className={`inline-block mt-1 text-xs font-medium px-2 py-1 rounded-full ${user.status === 'approved'
                        ? 'bg-green-100 text-green-700'
                        : user.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                        }`}
                    >
                      {user.status}
                    </span>
                  </Link>
                </div>
                <div className="flex items-center space-x-6">
                  <Link
                    href={`/admin/user-details/`}>
                    <View className="w-6 h-6 text-[#01BA5D] cursor-pointer" />
                  </Link>
                  <Pencil className="w-6 h-6 text-[#01BA5D] cursor-pointer"
                    onClick={() => {
                      setSelectedUser(user);
                      setNewStatus(user.status); // prefill current status
                      setShowStatusModal(true);
                    }}
                  />
                </div>
              </div>
            ))}
          </div>}
          {loading && <p>Loading...</p>}
        </div>

        {/* <button className="w-[60px] h-[60px] text-[#228B22] !shadow-xl hover:text-white duration-300 hover:bg-[#228B22] hover:border-transparent rounded-full flex justify-center items-center bg-[#FBFEFB] border-white-100 border-2 absolute bottom-6 right-4 z-10">
          <Icon icon="plusGreen" />
        </button> */}
      </div>
      {showStatusModal && selectedUser && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-xl p-6 w-96">
            <h3 className="text-xl font-bold mb-4">Update Status for {selectedUser.name}</h3>

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
                onClick={() => handleStatusUpdate()}
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

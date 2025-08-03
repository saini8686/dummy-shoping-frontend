"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Dialog } from "@headlessui/react";
import { getAllUserList } from "@/services/users.service";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    getAllUserList()
      .then((res) => {
        setUsers(res);
      })
      .catch((err) => console.error("Error fetching users:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setIsOpen(true);
  };

  if (loading) return <p>Loading users...</p>;
  if (!users || users.length === 0) return <p>No users found.</p>;

  return (
    <div className="mt-7 px-4">
      {users.map((obj, i) => (
        <div
          key={i}
          className="flex justify-between items-center mt-3 pb-1 border-b border-white-100 cursor-pointer"
          onClick={() => handleViewDetails(obj)}
        >
          <div className="flex items-center gap-1.5">
            <div className="border rounded-lg w-[60px] h-[60px] flex justify-center items-center border-white-100 overflow-hidden">
              <Image
                src={obj?.productImage || "/placeholder.png"}
                alt="list image"
                width={60}
                height={60}
                className="object-cover"
              />
            </div>
            <p>
              <span className="text-blacks-400 block text-base font-medium !leading-130">
                {obj.productName}
              </span>
              <span className="text-greys-1400 block text-sm font-normal !leading-130">
                {obj?.productPrize}
              </span>
            </p>
          </div>
          <p
            className={`py-1 px-2.5 text-sm text-[#324E32] font-semibold !leading-130 w-fit ${
              obj.inStock ? "bg-[#EAFFEA]" : "bg-[#E6E6E6]"
            }`}
          >
            {obj.inStock ? "In Stock" : "Out of Stock"}
          </p>
        </div>
      ))}

      {/* ✅ Popup Modal */}
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
            <Dialog.Title className="text-lg font-semibold mb-4">User Details</Dialog.Title>

            {selectedUser && (
              <div className="space-y-2">
                <div className="flex justify-center">
                  <Image
                    src={selectedUser.productImage || "/placeholder.png"}
                    alt="user"
                    width={120}
                    height={120}
                    className="rounded-lg object-cover"
                  />
                </div>
                <p><strong>Name:</strong> {selectedUser.productName}</p>
                <p><strong>Price:</strong> {selectedUser.productPrize}</p>
                <p>
                  <strong>Status:</strong>{" "}
                  {selectedUser.inStock ? "In Stock" : "Out of Stock"}
                </p>
              </div>
            )}

            <div className="mt-6 text-right">
              <button
                className="px-4 py-2 rounded-md bg-[#01be62] text-white hover:bg-green-600"
                onClick={() => setIsOpen(false)}
              >
                Close
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default Users;


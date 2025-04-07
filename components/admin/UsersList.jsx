"use client";
import React from "react";
import { Pencil, Trash2, User } from "lucide-react";
import Icon from "@/components/common/Icons";
import { useRouter } from "next/navigation";
import { userData } from "@/utils/helper";
import Link from "next/link";
import UserDetails from "./UserDetails";

const UsersList = () => {
  const router = useRouter();

  return (
    <div className="h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-md h-full w-full flex flex-col relative">
        {/* Green Panel Header */}
        <div className="bg-[#01BA5D] text-white p-4 rounded-b-3xl relative">
          <button
            onClick={() => router.back()}
            className="border-0 outline-0 bg-transparent mt-12"
          >
            <Icon icon="back" className="invert" />
          </button>
          <h2 className="text-2xl mt-7 mb-2 capitalize font-semibold font-roboto text-white !leading-130">
            Hi Admin!
          </h2>
          <p className="text-lg text-white font-normal !leading-130">
            Welcome back to your panel.
          </p>
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
            Users List
          </h3>

          {/* Scrollable List */}
          <div className="overflow-y-auto flex-1 pb-16">
            {userData.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between bg-[#F1FFF8] p-4 rounded-lg mb-3"
              >
                <div className="flex items-center">
                  <Link href="/admin/user-details" className="bg-white rounded-full me-6">
                    <Icon icon="userProfile" />
                  </Link>
                  <div>
                    <h4 className="text-[#01BE62] text-base font-bold !leading-130 mb-2">
                      {user.name}
                    </h4>
                    <p className="text-[#858585] text-xs">{user.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Pencil className="w-6 h-6 text-[#01BA5D] cursor-pointer" />
                  <Trash2 className="w-6 h-6 text-red-500 cursor-pointer" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Floating Add Button */}
        <button className="bg-[#01BA5D] w-[70px] h-[70px] rounded-full text-white flex items-center justify-center shadow-md absolute bottom-6 right-4 z-10">
          <div className="scale-[1.88]">
            <Icon icon="plus" />
          </div>
        </button>
      </div>
    </div>
  );
};

export default UsersList;

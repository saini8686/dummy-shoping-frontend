"use client";
import React from "react";
import Icon from "../common/Icons";
import { CustomButton } from "../common/CustomButton";
import { useRouter } from "next/navigation";
import { getUser } from "../../services/users.service"
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

const locations = [
  { id: 1, name: "Location Name", detail: "ipsum dolo / ipsum dolo" },
  { id: 2, name: "Location Name", detail: "ipsum dolo / ipsum dolo" },
  { id: 3, name: "Location Name", detail: "ipsum dolo / ipsum dolo" },
  { id: 4, name: "Location Name", detail: "ipsum dolo / ipsum dolo" },
];

const UserDetails = () => {
  const searchParams = useSearchParams();
  // let id = searchParams.get("id");
  // const router = useRouter();
  const [userData, setUserData] = useState([]);
  // const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const fetchUserDetails = async () => {
  //     try {
  //       const data = await getUser();
  //       console.log(data, 'All user details data');

  //       setUserData(data);
  //     } catch (error) {
  //       console.error('Error fetching user details:', error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchUserDetails();
  // }, []);

  // if (loading) return <p>Loading...</p>;

  return (
    <div className="w-full h-screen bg-white rounded-xl shadow-md">
      {/* Header */}
      <div className="bg-[#01BA5D] text-white p-4 rounded-b-3xl relative">
        <button
          onClick={() => router.back()}
          className="border-0 outline-0 bg-transparent mt-12"
        >
          <Icon icon="back" className="invert" />
        </button>
        <h2 className="text-2xl mt-[50px] mb-2 capitalize font-semibold font-roboto text-white !leading-130">
          User Details
        </h2>
      </div>

      {/* User Info */}
      <div className="py-9 px-4">
        <div className="bg-white border border-[#DCDCDC] rounded-xl px-3 py-4 flex items-center gap-5">
          <div className="min-w-[80px] min-h-[80px] flex items-center justify-center">
            <div className="scale-200">
              <Icon icon="userProfile" />
            </div>
          </div>
          <div>
            <h3 className="text-[#01BE62] font-bold mb-2">User No.#{userData.userId}</h3>
            <p className="text-[#858585] text-sm">
              <span className="font-bold text-[#010101]">Details:</span> Worem
              ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate
              libero et velit interdum, ac aliquet odio mattis. Class aptent
              taciti.
            </p>
          </div>
        </div>
      </div>

      {/* Location List */}
      <div className="px-4">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-[#010101] text-xl font-bold">Locations List</h4>
          <CustomButton customClass="!py-2 !px-3 !text-sm">
            Add More Locations
          </CustomButton>
        </div>

        <div className="space-y-3">
          {locations.map((loc) => (
            <div
              key={loc.id}
              className="flex justify-between items-center bg-[#F1FFF8] p-4 rounded-lg"
            >
              <div>
                <h5 className="text-[#01BA5D] font-bold text-base mb-1">
                  {loc.name}
                </h5>
                <p className="text-[#575757] text-xs font-semibold">
                  {loc.detail}
                </p>
              </div>
              <CustomButton customClass="!py-2 !px-3 !text-xs">
                Delete
              </CustomButton>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserDetails;

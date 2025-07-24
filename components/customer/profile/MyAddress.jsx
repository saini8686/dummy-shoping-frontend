"use client";
import Icon from "@/components/common/Icons";
import { useState } from "react";
import { updateUser } from "@/services/users.service";

const MyAddress = ({ userInfo }) => {
  const [address, setAddress] = useState(userInfo?.address || "");
  const [isEditing, setIsEditing] = useState(false);

  const handleEditToggle = () => {
    setIsEditing((prev) => !prev);
  };

  const handleDelete = () => {
    setAddress("");
  };

  const handleAddressChange = async (value) => {
    try {
      userInfo.address = value;
      console.log("info", userInfo);

      const response = await updateUser(userInfo);

      if (!response.ok && !response.success) {
        throw new Error("Update failed");
      }

      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Update failed:", error);
      alert("Failed to update profile.");
    }
    // setAddress(value);
  };

  return (
    <div className="flex gap-5 mt-4 justify-between border-b border-b-greys-900 pb-4 items-center">
      <div className="w-full">
        <h3 className="text-base text-blacks-200 font-medium !leading-130">
          Address
        </h3>
        <input
          type="text"
          value={address}
          onChange={(e) => handleAddressChange(e.target.value)}
          className={`border rounded py-1 px-1 outline-0 text-sm w-full text-greys-1200 font-normal mt-0.5 !leading-130 placeholder:text-greys-1200 ${isEditing ? "!border-greens-900" : "!border-transparent"
            }`}
          readOnly={!isEditing}
          placeholder="Enter address"
        />
      </div>
      <div className="flex gap-5 items-center">
        <button className="hover:invert duration-300" onClick={handleEditToggle}>
          <Icon icon={isEditing ? "saveAddress" : "pencilAddresse"} />
        </button>
        <button className="hover:invert duration-300" onClick={handleDelete}>
          <Icon icon="deleteAddresse" />
        </button>
      </div>
    </div>
  );
};

export default MyAddress;

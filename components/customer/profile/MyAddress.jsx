"use client";
import Icon from "@/components/common/Icons";
import { USER_ADDRESSE_DATA } from "@/utils/helper";
import { useState } from "react";

const MyAddress = () => {
  const [addresses, setAddresses] = useState(USER_ADDRESSE_DATA);

  const handleEdit = (index, newAddress) => {
    const updatedAddresses = [...addresses];
    updatedAddresses[index].address = newAddress;
    setAddresses(updatedAddresses);
  };

  const handleDelete = (index) => {
    const updatedAddresses = addresses.filter((_, i) => i !== index);
    setAddresses(updatedAddresses);
  };
  return (
    <>
      {addresses.map((obj, i) => (
        <div
          key={i}
          className="flex gap-5 mt-4 justify-between border-b border-b-greys-900 pb-4 items-center"
        >
          <div className="w-full">
            <h3 className="text-base text-blacks-200 font-medium !leading-130">
              {obj.label}
            </h3>
            <input
              type="text"
              value={obj.address} // Assuming each address has an `address` property
              onChange={(e) => handleEdit(i, e.target.value)} // Handle input change
              className="border-0 outline-0 text-sm w-full text-greys-1200 font-normal mt-0.5 !leading-130 placeholder:text-greys-1200"
            />
          </div>
          <div className="flex gap-5 items-center">
            <button
              className="hover:invert duration-300"
              onClick={() => handleEdit(i, obj.address)} // Edit action (already happens on change)
            >
              <Icon icon="pencilAddresse" />
            </button>
            <button
              className="hover:invert duration-300"
              onClick={() => handleDelete(i)} // Delete action
            >
              <Icon icon="deleteAddresse" />
            </button>
          </div>
        </div>
      ))}
    </>
  );
};

export default MyAddress;

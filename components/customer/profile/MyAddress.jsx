"use client";
import Icon from "@/components/common/Icons";
import { USER_ADDRESSE_DATA } from "@/utils/helper";
import { useState } from "react";

const MyAddress = () => {
  const [addresses, setAddresses] = useState(USER_ADDRESSE_DATA);

  const [isEditing, setIsEditing] = useState(
    new Array(USER_ADDRESSE_DATA.length).fill(false)
  );

  const handleEdit = (index) => {
    const newEditState = [...isEditing];
    newEditState[index] = !newEditState[index];
    setIsEditing(newEditState);
  };

  const handleSave = (index) => {
    setIsEditing((prevState) => {
      const newState = [...prevState];
      newState[index] = false;
      return newState;
    });
  };

  const handleDelete = (index) => {
    const updatedAddresses = addresses.filter((_, i) => i !== index);
    setAddresses(updatedAddresses);
  };

  const handleAddressChange = (index, newAddress) => {
    const updatedAddresses = [...addresses];
    updatedAddresses[index].name = newAddress;
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
              value={obj.name}
              onChange={(e) => handleAddressChange(i, e.target.value)}
              className={`border rounded py-1 px-1 outline-0 text-sm w-full text-greys-1200 font-normal mt-0.5 !leading-130 placeholder:text-greys-1200 ${
                isEditing[i] ? "!border-greens-900" : "!border-transparent"
              }`}
              readOnly={!isEditing[i]}
            />
          </div>
          <div className="flex gap-5 items-center">
            <button
              className="hover:invert duration-300"
              onClick={() => {
                if (isEditing[i]) {
                  handleSave(i);
                } else {
                  handleEdit(i);
                }
              }}
            >
              <Icon icon={isEditing[i] ? "saveAddress" : "pencilAddresse"} />
            </button>
            <button
              className="hover:invert duration-300"
              onClick={() => handleDelete(i)}
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

import Link from "next/link";
import React from "react";

const SelectRole = () => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-3  text-white text-center !leading-130">
        Select Role
      </h2>
      <p className="max-w-[319px] mx-auto text-sm text-center text-white">
        Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet
        sint.
      </p>

      <Link
        href="?steps=2&auth=shopkepper"
        className="block mt-3 py-[15px] w-full border-white border rounded-lg text-center text-white font-semibold hover:bg-white duration-300 hover:!text-greens-900"
      >
        Shopkeeper
      </Link>
      <Link
        href="?steps=2&auth=customer"
        className="block py-[15px] w-full border-white border rounded-lg text-center text-white font-semibold mt-3 hover:bg-white duration-300 hover:!text-greens-900"
      >
        Customer
      </Link>
      <Link
        href="?steps=2&auth=admin/user-list"
        className="block py-[15px] w-full border-white border rounded-lg text-center text-white font-semibold mt-3 hover:bg-white duration-300 hover:!text-greens-900"
      >
        Admin
      </Link>
    </div>
  );
};

export default SelectRole;

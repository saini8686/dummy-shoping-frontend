import React from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

const SelectRole = () => {
  const router = useRouter();

  const selectRole = (role) => {
    const roleLower = role.toLowerCase();

    // ✅ store selected role in cookies
    Cookies.set("auth", roleLower, { sameSite: "Lax", secure: true });
    Cookies.set("userRole", roleLower, { sameSite: "Lax", secure: true });

    // ✅ navigate to login/sign-up page
    router.push(`/sign-in?auth=${roleLower}`);
  };

  return (
    <div className="px-4">
      <h2 className="text-2xl font-semibold mb-3 text-white text-center !leading-130">
        Select Role
      </h2>
      <p className="max-w-[319px] mx-auto text-sm text-center text-white">
        Please select your role from the options below to proceed.
      </p>

      <button
        onClick={() => selectRole("shopkepper")}
        className="block mt-3 py-[15px] w-full border-white border rounded-lg text-center text-white font-semibold hover:bg-white duration-300 hover:!text-greens-900"
      >
        shopkepper
      </button>

      <button
        onClick={() => selectRole("customer")}
        className="block py-[15px] w-full border-white border rounded-lg text-center text-white font-semibold mt-3 hover:bg-white duration-300 hover:!text-greens-900"
      >
        Customer
      </button>

      <button
        onClick={() => selectRole("admin")}
        className="block py-[15px] w-full border-white border rounded-lg text-center text-white font-semibold mt-3 hover:bg-white duration-300 hover:!text-greens-900"
      >
        Admin
      </button>
    </div>
  );
};

export default SelectRole;

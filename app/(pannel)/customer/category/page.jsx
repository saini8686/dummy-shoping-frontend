import CategoryList from "@/components/customer/category/CategoryList";
import HeaderCustomer from "@/components/customer/HeaderCustomer";
import React from "react";

const page = () => {
  return (
    <div className="bg-white-low">
      <HeaderCustomer />
      <CategoryList />
    </div>
  );
};

export default page;

import BottomBar from "@/components/common/BottomBar";
import CategoryList from "@/components/customer/category/CategoryList";
import HeaderCustomer from "@/components/customer/HeaderCustomer";
import React from "react";

const page = () => {
  return (
    <div className="bg-white-low">
      <div className="pb-16 px-4">
        <HeaderCustomer />
        <CategoryList />
      </div>
      <BottomBar />
    </div>
  );
};

export default page;

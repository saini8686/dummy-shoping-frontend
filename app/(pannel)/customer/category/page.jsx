import BottomBar from "@/components/common/BottomBar";
import CategoryList from "@/components/customer/category/CategoryList";
import HeaderCustomer from "@/components/customer/HeaderCustomer";
import React from "react";

const page = () => {
  return (
    <div className="bg-white-low">
      <div className="pb-20 px-4">
        <HeaderCustomer name="category" />
        <CategoryList />
      </div>
      <BottomBar />
    </div>
  );
};

export default page;

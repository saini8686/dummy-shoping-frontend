import BottomBar from "@/components/common/BottomBar";
import Navbar from "@/components/common/Navbar";
import SearchBar from "@/components/common/SearchBar";
import OfferSlider from "@/components/customer/OfferSlider";
import ProductCategory from "@/components/customer/ProductCategory";
import TopBarProduct from "@/components/customer/TopBarProduct";
import { BEST_SELLER_LIST } from "@/utils/helper";
import React from "react";

const page = () => {
  return (
    <div className="bg-white-low">
      <Navbar />
      <div className="px-4 mt-8">
        <SearchBar />
        <TopBarProduct />
        <ProductCategory category="Bestseller" productList={BEST_SELLER_LIST} />
        <ProductCategory
          category="Grocery Store"
          productList={BEST_SELLER_LIST}
        />
        <ProductCategory
          category="Electronic Store"
          productList={BEST_SELLER_LIST}
        />
      </div>

      {/* slider */}
      <OfferSlider />
      <div className="px-4 pb-16">
        <ProductCategory
          category="Stationery Store"
          productList={BEST_SELLER_LIST}
        />
        <ProductCategory
          category="Fashion Store"
          productList={BEST_SELLER_LIST}
        />
        <ProductCategory
          category="Fruits & Vegetables Store"
          productList={BEST_SELLER_LIST}
        />
        <ProductCategory
          category="Restaurant/Dhaba"
          productList={BEST_SELLER_LIST}
        />
        <ProductCategory
          category="Medical Store"
          productList={BEST_SELLER_LIST}
        />
        <ProductCategory
          category="Furniture Store"
          productList={BEST_SELLER_LIST}
        />
        <ProductCategory
          category="Kitchen Store"
          productList={BEST_SELLER_LIST}
        />
        <ProductCategory
          category="Cosmetic Store"
          productList={BEST_SELLER_LIST}
        />
        <ProductCategory
          category="Jewellery Shop"
          productList={BEST_SELLER_LIST}
        />
        <ProductCategory
          category="Sweets Store"
          productList={BEST_SELLER_LIST}
        />
      </div>
      <BottomBar/>
    </div>
  );
};

export default page;

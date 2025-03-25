import { CustomButton } from "@/components/common/CustomButton";
import Navbar from "@/components/common/Navbar";
import PreLoader from "@/components/common/PreLoader";
import ProductCard from "@/components/common/ProductCard";
import SearchBar from "@/components/common/SearchBar";
import ProductCategory from "@/components/home/ProductCategory";
import TopBarProduct from "@/components/home/TopBarProduct";
import { BEST_SELLER_LIST } from "@/utils/helper";

export default function Home() {
  return (
    <div>
      <PreLoader />
      <div>
        <Navbar />
        <div className="px-4 mt-8">
          <SearchBar />
          <TopBarProduct />
          <ProductCategory
            category="Bestseller"
            productList={BEST_SELLER_LIST}
          />
          <ProductCategory
            category="Grocery Store"
            productList={BEST_SELLER_LIST}
          />
          <ProductCategory
            category="Electronic Store"
            productList={BEST_SELLER_LIST}
          />
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
      </div>
    </div>
  );
}

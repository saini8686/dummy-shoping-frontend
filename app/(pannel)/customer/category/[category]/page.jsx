import BottomBar from "@/components/common/BottomBar";
import SearchBar from "@/components/common/SearchBar";
import ListPartProduct from "@/components/customer/category/sub-part/ListPartProduct";
import OfferSliderCategory from "@/components/customer/category/sub-part/OfferSliderCategory";
import ProductShow from "@/components/customer/category/sub-part/ProductShow";
import ScrollProduct from "@/components/customer/category/sub-part/ScrollProduct";
import HeaderCustomer from "@/components/customer/HeaderCustomer";
import { EXCLUSIVE_OFFER_LIST } from "@/utils/helper";

const page = () => {
  return (
    <div className="bg-white-low">
      <HeaderCustomer location name="Grocery" />
      <div className="pb-20 px-4">
        <SearchBar />
        <ListPartProduct />
        <OfferSliderCategory />
        <ProductShow
          category="Exclusive Offer"
          productList={EXCLUSIVE_OFFER_LIST}
        />
        <ScrollProduct />
        <ProductShow productList={EXCLUSIVE_OFFER_LIST} />
        <ProductShow productList={EXCLUSIVE_OFFER_LIST} />
        <ProductShow productList={EXCLUSIVE_OFFER_LIST} />
        <ProductShow productList={EXCLUSIVE_OFFER_LIST} />
      </div>
      <BottomBar />
    </div>
  );
};

export default page;

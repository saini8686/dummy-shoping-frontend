import BottomBar from "@/components/common/BottomBar";
import SearchBar from "@/components/common/SearchBar";
import ListPartProduct from "@/components/customer/category/sub-part/ListPartProduct";
import OfferSliderCategory from "@/components/customer/category/sub-part/OfferSliderCategory";
import HeaderCustomer from "@/components/customer/HeaderCustomer";

const page = () => {
  return (
    <div className="bg-white-low">
      <HeaderCustomer location name="Grocery" />
      <div className="pb-20 px-4">
        <SearchBar />
        <ListPartProduct />
        <OfferSliderCategory />
      </div>
      <BottomBar />
    </div>
  );
};

export default page;

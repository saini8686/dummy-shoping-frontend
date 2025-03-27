import BottomBar from "@/components/common/BottomBar";
import SearchBar from "@/components/common/SearchBar";
import HeaderCustomer from "@/components/customer/HeaderCustomer";
import NearByShare from "@/components/customer/nearby-share/NearByShare";

const page = () => {
  return (
    <div className="bg-white-low">
        <HeaderCustomer name="Nearby Shops" />
      <div className="pb-20 px-4">
        <SearchBar />
        <NearByShare />
      </div>
      <BottomBar />
    </div>
  );
};

export default page;

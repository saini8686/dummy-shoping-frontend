import SearchBar from "@/components/common/SearchBar";
import BottomBarAdmin from "@/components/admin/common/BottomBarAdmin";
import HeaderCustomer from "@/components/customer/HeaderCustomer";
import Recharges from "@/components/admin/Recharges";

const page = () => {
  return (
    <div className="bg-white-low">
      <HeaderCustomer name="Shop recharge request" />
      <div className="pb-20 relative z-[1] mt-8 px-4">
        {/* <SearchBar /> */}
        <Recharges />
        <BottomBarAdmin />
      </div>
    </div>
  );
};

export default page;

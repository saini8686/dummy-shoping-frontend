import Icon from "@/components/common/Icons";
import SearchBar from "@/components/common/SearchBar";
import BottomBarShopKepper from "@/components/shopkepper/common/BottomBarShopKepper";
import NavbarShopkepper from "@/components/shopkepper/product/NavbarShopkepper";
import HeaderCustomer from "@/components/customer/HeaderCustomer";
import CoustomerPayments from "@/components/customer/payment/Payments";
import Link from "next/link";
import BottomBar from "@/components/common/BottomBar";

const page = () => {
  return (
    <div className="bg-white-low">
      <HeaderCustomer name="Payment" />
      <div className="pb-20 relative z-[1] mt-8 px-4">
        <SearchBar />
        <CoustomerPayments />
        <BottomBar />
      </div>
    </div>
  );
};

export default page;

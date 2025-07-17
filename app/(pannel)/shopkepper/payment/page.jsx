import Icon from "@/components/common/Icons";
import SearchBar from "@/components/common/SearchBar";
import BottomBarShopKepper from "@/components/shopkepper/common/BottomBarShopKepper";
import NavbarShopkepper from "@/components/shopkepper/product/NavbarShopkepper";
import Payments from "@/components/shopkepper/payment/Payments";
import Link from "next/link";

const page = () => {
  return (
    <div className="bg-white-low">
      <NavbarShopkepper />
      <div className="pb-20 relative z-[1] mt-8 px-4">
        <SearchBar />
        <Payments />
        <BottomBarShopKepper />
      </div>
    </div>
  );
};

export default page;

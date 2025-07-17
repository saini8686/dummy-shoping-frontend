import SearchBar from "@/components/common/SearchBar";
import BottomBarAdmin from "@/components/admin/common/BottomBarAdmin";
import NavbarShopkepper from "@/components/shopkepper/product/NavbarShopkepper";
import Payments from "@/components/shopkepper/payment/Payments";

const page = () => {
  return (
    <div className="bg-white-low">
      <NavbarShopkepper />
      <div className="pb-20 relative z-[1] mt-8 px-4">
        <SearchBar />
        <Payments />
        <BottomBarAdmin />
      </div>
    </div>
  );
};

export default page;

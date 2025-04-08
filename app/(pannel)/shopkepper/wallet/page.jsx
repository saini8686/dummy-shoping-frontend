import HeaderCustomer from "@/components/customer/HeaderCustomer";
import BottomBarShopKepper from "@/components/shopkepper/common/BottomBarShopKepper";
import RecentTransition from "@/components/shopkepper/wallet/RecentTransition";
import TotalAmount from "@/components/shopkepper/wallet/TotalAmount";

const page = () => {
  return (
    <div className="bg-white-low">
      <HeaderCustomer name="Wallet" />
      <div className="pb-20 mt-10 px-4">
        <TotalAmount />
        <RecentTransition />
        <BottomBarShopKepper />
      </div>
    </div>
  );
};

export default page;

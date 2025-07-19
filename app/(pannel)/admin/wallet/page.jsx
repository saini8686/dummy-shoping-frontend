import HeaderCustomer from "@/components/customer/HeaderCustomer";
import BottomBarAdmin from "@/components/admin/common/BottomBarAdmin";
import RecentTransition from "@/components/shopkepper/wallet/RecentTransition";
import TotalAmount from "@/components/shopkepper/wallet/TotalAmount";

const page = () => {
  return (
    <div className="bg-white-low">
      <HeaderCustomer name="Wallet" />
      <div className="pb-20 mt-10 px-4">
        <TotalAmount />
        <RecentTransition />
        <BottomBarAdmin />
      </div>
    </div>
  );
};

export default page;

import HeaderCustomer from "@/components/customer/HeaderCustomer";
import RecentTransition from "@/components/shopkepper/wallet/RecentTransition";
import TotalAmount from "@/components/shopkepper/wallet/TotalAmount";

const page = () => {
  return (
    <div className="bg-white-low">
      <HeaderCustomer name="Wallet" />
      <div className="pb-20 mt-10 px-4">
        <TotalAmount />
        <RecentTransition />
      </div>
    </div>
  );
};

export default page;

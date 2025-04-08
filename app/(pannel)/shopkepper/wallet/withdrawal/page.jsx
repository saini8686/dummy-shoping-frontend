import HeaderCustomer from "@/components/customer/HeaderCustomer";
import RecentTransition from "@/components/shopkepper/wallet/RecentTransition";
import TotalAmount from "@/components/shopkepper/wallet/TotalAmount";
import Withdrawal from "@/components/shopkepper/wallet/withdrawal/Withdrawal";

const page = () => {
  return (
    <div className="bg-white-low">
      <HeaderCustomer name="Withdrawal" />
      <div className="pb-20 mt-10 px-4">
        <Withdrawal />
      </div>
    </div>
  );
};

export default page;

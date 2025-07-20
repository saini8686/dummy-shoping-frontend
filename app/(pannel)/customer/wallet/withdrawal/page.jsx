import HeaderCustomer from "@/components/customer/HeaderCustomer";
import Withdrawal from "@/components/shopkepper/wallet/withdrawal/Withdrawal";
import { Suspense } from "react";

const page = () => {
  return (

    <Suspense>
      <div className="bg-white-low">
        <HeaderCustomer name="Withdrawal" />
        <div className="pb-20 mt-10 px-4">
          <Withdrawal />
        </div>
      </div>
    </Suspense>
  );
};

export default page;

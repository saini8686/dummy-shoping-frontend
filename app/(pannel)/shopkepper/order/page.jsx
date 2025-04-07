
import SearchBar from "@/components/common/SearchBar";
import BottomBarShopKepper from "@/components/shopkepper/common/BottomBarShopKepper";
import Orders from "@/components/shopkepper/order/Orders";
import OrderTabList from "@/components/shopkepper/order/OrderTabList";
import NavbarShopkepper from "@/components/shopkepper/product/NavbarShopkepper";
import { Suspense } from "react";

const page = () => {
  return (
    <Suspense>
      {" "}
      <div className="bg-white-low">
        <NavbarShopkepper />
        <div className="pb-20 relative z-[1] mt-8 px-4">
          <SearchBar />
          <OrderTabList />
          <Orders />
          <BottomBarShopKepper />
        </div>
      </div>
    </Suspense>
  );
};

export default page;

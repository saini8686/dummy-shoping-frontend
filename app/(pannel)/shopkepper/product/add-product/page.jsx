import HeaderCustomer from "@/components/customer/HeaderCustomer";
import AddProductForm from "@/components/shopkepper/product/AddProductForm";
import { Suspense } from "react";

const page = () => {
  return (
    <Suspense>
      <div className="bg-white-low">
        <HeaderCustomer name="Add Product" />
        <div className="pb-20 mt-10 px-4">
          <AddProductForm />
        </div>
      </div>
    </Suspense>
  );
};

export default page;

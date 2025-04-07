import ProductDetails from "@/components/customer/category/sub-part/ProductDetails";
import HeaderCustomer from "@/components/customer/HeaderCustomer";

const page = () => {
  return (
    <div className="bg-white-low">
      <HeaderCustomer name="Product Details" />
      <div className="pb-20 px-4 mt-2">
        <ProductDetails/>
      </div>
    </div>
  );
};

export default page;

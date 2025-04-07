import HeaderCustomer from "@/components/customer/HeaderCustomer";
import CartCard from "@/components/customer/item-details/CartCard";

const page = () => {
  return (
    <div className="bg-white-low">
      <HeaderCustomer name="Item Details" />
      <div className="pb-20 px-4">
        <CartCard />
      </div>
    </div>
  );
};

export default page;

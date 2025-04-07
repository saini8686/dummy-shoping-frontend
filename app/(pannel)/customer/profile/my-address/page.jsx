import HeaderCustomer from "@/components/customer/HeaderCustomer";
import MyAddress from "@/components/customer/profile/MyAddress";

const page = () => {
  return (
    <div className="bg-white-low">
      <HeaderCustomer name="My Addresse" />
      <div className="pb-20 mt-9 px-4">
       <MyAddress />
      </div>
    </div>
  );
};

export default page;

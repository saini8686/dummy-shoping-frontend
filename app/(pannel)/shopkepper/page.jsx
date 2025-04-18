import HeaderCustomer from "@/components/customer/HeaderCustomer";
import BasicDetailForm from "@/components/shopkepper/detail/BasicDetailForm";

const page = () => {
  return (
    <div className="bg-white-low">
      <HeaderCustomer />
      <div className="pb-20 mt-10 px-4">
        <BasicDetailForm />
      </div>
    </div>
  );
};

export default page;

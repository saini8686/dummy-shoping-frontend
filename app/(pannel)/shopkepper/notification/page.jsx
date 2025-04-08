import HeaderCustomer from "@/components/customer/HeaderCustomer";
import Notification from "@/components/shopkepper/notification/Notification";

const page = () => {
  return (
    <div className="bg-white-low">
      <HeaderCustomer name="Notifications" />
      <div className="pb-20 mt-10 px-4">
        <Notification />
      </div>
    </div>
  );
};

export default page;

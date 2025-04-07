import BottomBar from "@/components/common/BottomBar";
import HeaderCustomer from "@/components/customer/HeaderCustomer";
import Notification from "@/components/customer/notification/Notification";

const page = () => {
  return (
    <div className="bg-white-low">
      <HeaderCustomer name="Notifications" />
      <div className="pb-20 px-4">
        <Notification />
      </div>
      <BottomBar />
    </div>
  );
};

export default page;

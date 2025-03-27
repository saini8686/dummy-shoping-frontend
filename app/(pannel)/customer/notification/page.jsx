import BottomBar from "@/components/common/BottomBar";
import SearchBar from "@/components/common/SearchBar";
import HeaderCustomer from "@/components/customer/HeaderCustomer";
import NearByShare from "@/components/customer/nearby-share/NearByShare";
import Notification from "@/components/customer/notification/Notification";

const page = () => {
  return (
    <div className="bg-white-low">
      <div className="pb-20 px-4">
        <HeaderCustomer name="Notifications" />
        <Notification />
      </div>
      <BottomBar />
    </div>
  );
};

export default page;

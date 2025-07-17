import HeaderCustomer from "@/components/customer/HeaderCustomer";
import Setting from "@/components/customer/profile/Setting";
import UserInfo from "@/components/customer/profile/UserInfo";

const page = () => {
  return (
    <div className="bg-white-low">
      <HeaderCustomer name="Profile" />
      <div className="pb-20 mt-10 px-4">
        <UserInfo />
        <Setting />
      </div>
    </div>
  );
};

export default page;

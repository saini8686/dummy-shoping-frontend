import HeaderCustomer from "@/components/customer/HeaderCustomer";
import UserData from "@/components/customer/profile/UserData";

const page = () => {
  return (
    <div className="bg-white-low">
      <HeaderCustomer name="Edit Profile" />
      <div className="pb-20 mt-7 px-4">
        <UserData />
      </div>
    </div>
  );
};

export default page;

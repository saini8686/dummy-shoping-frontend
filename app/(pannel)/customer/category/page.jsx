import BottomBar from "@/components/common/BottomBar";
import CategoryList from "@/components/customer/category/CategoryList";
import HeaderCustomer from "@/components/customer/HeaderCustomer";

const page = () => {
  return (
    <div className="bg-white-low">
      <HeaderCustomer name="category" />
      <div className="pb-20 px-4">
        <CategoryList />
      </div>
      <BottomBar />
    </div>
  );
};

export default page;

import HeaderCustomer from "@/components/customer/HeaderCustomer";
import UploadShopImage from "@/components/shopkepper/detail/UploadShopImage";

const page = () => {
  return (
    <div className="bg-white-low">
      <HeaderCustomer classCard="!h-[120px]" />
      <div className="pb-20 mt-10 px-4">
        <UploadShopImage />
      </div>
    </div>
  );
};

export default page;

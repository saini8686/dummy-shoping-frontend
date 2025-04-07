import SearchBar from "@/components/common/SearchBar";
import NavbarShopkepper from "@/components/shopkepper/product/NavbarShopkepper";

const page = () => {
  return (
    <div className="bg-white-low">
      <NavbarShopkepper />
      <div className="pb-20 mt-8 px-4">
        <SearchBar />
      </div>
    </div>
  );
};

export default page;

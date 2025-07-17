'use client';

import { useState } from "react";
import BottomBar from "@/components/common/BottomBar";
import SearchBar from "@/components/common/SearchBar";
import Navbar from "@/components/common/Navbar";
import NearByShare from "@/components/customer/nearby-share/NearByShare";

const Page = () => {
  const [search, setSearch] = useState('');

  return (
    <div className="bg-white-low">
      <Navbar />
      {/* <HeaderCustomer name="Nearby Shops" /> */}
      <div className="pb-20 px-4">
        <SearchBar search={search} setSearch={setSearch} />
        <NearByShare search={search} />
      </div>
      <BottomBar />
    </div>
  );
};

export default Page;

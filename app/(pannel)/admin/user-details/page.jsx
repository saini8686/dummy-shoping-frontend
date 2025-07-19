import UserDetails from "@/components/admin/UserDetails";
import PreLoader from "@/components/common/PreLoader";
import React, { Suspense } from "react";
import BottomBarAdmin from '@/components/admin/common/BottomBarAdmin'

const page = () => {
  return (
    <Suspense>
      <UserDetails />
      <BottomBarAdmin />
    </Suspense>

  );
};

export default page;

import UserDetails from "@/components/admin/UserDetails";
import PreLoader from "@/components/common/PreLoader";
import React, { Suspense } from "react";

const page = () => {
  return (
    <Suspense>
      <UserDetails />
    </Suspense>

  );
};

export default page;

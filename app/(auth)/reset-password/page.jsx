import ResetPassword from "@/components/auth/ResetPassword";
import { Suspense } from "react";

const page = () => {
  return (
    <Suspense>
      <ResetPassword/>
    </Suspense>
  );
};

export default page;

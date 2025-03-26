import SignUp from "@/components/auth/SignUp";
import { Suspense } from "react";

const page = () => {
  return (
    <Suspense>
      <SignUp />
    </Suspense>
  );
};

export default page;

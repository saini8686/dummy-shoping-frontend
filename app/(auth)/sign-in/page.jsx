import SignIn from "@/components/auth/SignIn";
import { Suspense } from "react";

const page = () => {
  return (
    <Suspense>
      <SignIn />
    </Suspense>
  );
};

export default page;

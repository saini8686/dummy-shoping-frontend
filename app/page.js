import PreLoader from "@/components/common/PreLoader";
import { Suspense } from "react";

export default function Home() {
  return (
    <>
      <Suspense>
        <PreLoader />
      </Suspense>
    </>
  );
}

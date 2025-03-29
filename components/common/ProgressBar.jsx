"use client";
import { usePathname, useRouter } from "next/navigation";
import NextTopLoader from "nextjs-toploader";
import * as NProgress from "nprogress";
import { useEffect } from "react";

const ProgressBar = () => {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    NProgress.start();
    NProgress.done();
  }, [pathname, router]);

  return (
    
      <NextTopLoader
        showForHashAnchor={false}
        color="white"
        initialPosition={0.08}
        height={4}
        showSpinner
        easing="ease"
        speed={200}
        zIndex={100000}
      />
  );
};

export default ProgressBar;

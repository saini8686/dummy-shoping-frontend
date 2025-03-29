"use client";
import Icon from "@/components/common/Icons";
import useAuthStore from "@/store/useAuthStore";
import { SETTING_LIST } from "@/utils/helper";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as NProgress from "nprogress";

const Setting = () => {
  const { signOut } = useAuthStore();
  const router = useRouter();
  const handleSignOut = async () => {
    NProgress.start();
    try {
      await signOut();
      router.push("/sign-in");
    } catch (error) {
      console.error("Error signing out:", error);
    }
    NProgress.done();
  };

  return (
    <div className="mt-10">
      {SETTING_LIST.map((obj, i) => (
        <Link
          key={i}
          onClick={i === SETTING_LIST.length - 1 ? handleSignOut : null}
          href={obj.path}
          className="flex gap-2.5 border-b border-b-white-100 py-3 px-2.5 items-center"
        >
          <span className="w-[44px] h-[44px] flex justify-center items-center">
            <Icon icon={obj.icon} />
          </span>
          <p className="text-blues-300 font-medium text-sm !leading-130">
            {obj.name}
          </p>
        </Link>
      ))}
    </div>
  );
};

export default Setting;

"use client";
import Icon from "@/components/common/Icons";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const HeaderCustomer = ({ name, location ,classCard }) => {
  const router = useRouter();
  return (
    <div
      className={`pt-[50px] pb-4 h-[176px] rounded-b-3xl  bg-greens-900 px-4 ${classCard}`}
    >
      <div className="flex justify-between items-center">
        <button
          onClick={() => router.back()}
          className="border-0 outline-0 bg-transparent"
        >
          <Icon icon="back" className="invert" />
        </button>
        <Link href="/customer">
          <Image
            src="/assets/images/svg/logo.svg"
            width={100}
            height={39}
            sizes="100vw"
            className="object-cover"
            alt="logo"
          />
        </Link>
      </div>
      <div className={`mt-2 ${!location && "!mt-8"}`}>
        {location && (
          <div className="flex gap-1.5 text-white items-center">
            <Icon icon="locationWhite" />
            <p className="text-lg text-white font-semibold !leading-130">
              Dhaka, Banassre
            </p>
          </div>
        )}
        <h2 className="text-2xl mt-2 capitalize font-semibold  font-roboto text-white !leading-130">
          {name}
        </h2>
      </div>
    </div>
  );
};

export default HeaderCustomer;

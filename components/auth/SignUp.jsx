"use client";
import { LOGIN_WAY_LIST } from "@/utils/helper";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { CustomButton } from "../common/CustomButton";
import { CustomInput } from "./common/CustomInput";
import { useSearchParams } from "next/navigation";
import Icon from "../common/Icons";

const SignUp = () => {
  const [formDetails, setFormDetails] = useState({
    loginId: "",
    address: "",
    refferCode: "",
  });
  const [isChecked, setIsChecked] = useState(false);
  const searchParams = useSearchParams();
  let auth = searchParams.get("auth");
  const [error, setError] = useState(false);
  const submitHandler = async (e) => {
    e.preventDefault();
    setError(true);
    if (formDetails.loginId && formDetails.address) {
      setLoading(true);
    }
  };
  return (
    <div>
      <div className="px-4">
        <h2 className="mt-3 text-2xl font-semibold text-black !leading-130">
          SignUp
        </h2>
        <div className="flex items-center mt-8 justify-between  gap-5">
          {LOGIN_WAY_LIST.map((obj, i) => (
            <div
              key={i}
              className="border rounded flex justify-center items-center w-[100px] h-[72px] border-greys-700"
            >
              <div className="text-center">
                <Image
                  src={obj.image}
                  width={20}
                  height={25}
                  sizes="100vw"
                  className="object-contain flex mx-auto"
                  alt="logo"
                />
                <p className="text-sm font-semibold mt-2 text-black !leading-130">
                  {obj.name}
                </p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-greens-900 mt-10 mb-8 font-medium leading-130 text-center">
          Or
        </p>
        <form onSubmit={(e) => submitHandler(e)}>
          <CustomInput
            placeholder="Phone number or Email"
            name="loginId"
            value={formDetails.loginId}
            onChange={(e) =>
              setFormDetails({
                ...formDetails,
                loginId: e.target.value,
              })
            }
          />
          {error && formDetails.loginId.length === 0 ? (
            <span className="text-red-500 mt-1.5 text-xs block">
              loginId Is Rquired
            </span>
          ) : (
            ""
          )}
          <CustomInput
            customClass="mt-4"
            placeholder="Address"
            name="address"
            value={formDetails.address}
            onChange={(e) =>
              setFormDetails({
                ...formDetails,
                address: e.target.value,
              })
            }
          />
          {error && formDetails.address.length === 0 ? (
            <span className="text-red-500 mt-1.5 text-xs block">
              Address Is Rquired
            </span>
          ) : (
            ""
          )}
          <p className="text-greens-900 my-6 font-medium leading-130 text-center">
            Or
          </p>
          <CustomButton customClass="w-full gap-3 justify-center flex items-center !py-3.5">
            <Icon icon="locationWhite" /> Choose Location from Google
          </CustomButton>
          <label className="flex w-fit ml-auto gap-2 mt-4 items-center">
            <input
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
              type="checkbox"
              className="w-[18px]  h-[18px] checked:bg-greens-900 checked:border-transparent accent-greens-900/50"
            />
            <p>Any Refer Code</p>
          </label>
          {isChecked && (
            <CustomInput
              customClass="mt-4"
              placeholder="Referral Code"
              name="refferCode"
              value={formDetails.refferCode}
              onChange={(e) =>
                setFormDetails({
                  ...formDetails,
                  refferCode: e.target.value,
                })
              }
            />
          )}
          <CustomButton customClass="w-full !py-3.5 mt-7" isSubmit>
            Continue
          </CustomButton>
        </form>
        <p className="text-greys-dark-400 text-center mt-8 text-xs !leading-130">
          By continuing, you agreeing to our&nbsp;
          <Link
            href="#"
            className="text-greens-900 underline hover:no-underline"
          >
            Terms & Conditions
          </Link>
        </p>
        <Link
          href={`/sign-in?auth=${auth}`}
          className="transparent-green-border-button mb-5"
        >
          Are you Customer ? Sign in
        </Link>
      </div>
    </div>
  );
};

export default SignUp;

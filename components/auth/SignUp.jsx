"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { CustomButton } from "../common/CustomButton";
import Icon from "../common/Icons";
import { CustomInput } from "./common/CustomInput";
import LoginWay from "./common/LoginWay";
import { AgreementConfirm, OptionWay } from "./common/common";

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
    <div className="px-4">
      <h2 className="mt-3 text-2xl font-semibold text-black !leading-130">
        SignUp
      </h2>
      <LoginWay />
      <OptionWay />
      <form onSubmit={(e) => submitHandler(e)}>
        <CustomInput
          placeholder="Phone number or Email"
          name="loginId"
          type="text"
          error={!formDetails.loginId && error}
          errorText="loginId Is Rquired"
          value={formDetails.loginId}
          onChange={(e) =>
            setFormDetails({
              ...formDetails,
              loginId: e.target.value,
            })
          }
        />
        <CustomInput
          customClass="mt-4"
          placeholder="Address"
          name="address"
          type="text"
          error={!formDetails.address && error}
          errorText={"Address Is Rquired"}
          value={formDetails.address}
          onChange={(e) =>
            setFormDetails({
              ...formDetails,
              address: e.target.value,
            })
          }
        />
        <OptionWay />
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
      <AgreementConfirm />
      <Link
        href={`/sign-in?auth=${auth}`}
        className="transparent-green-border-button mb-5"
      >
        Are you Customer ? Sign in
      </Link>
    </div>
  );
};
export default SignUp;

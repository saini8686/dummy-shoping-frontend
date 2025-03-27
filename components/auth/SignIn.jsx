"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { CustomButton } from "../common/CustomButton";
import { CustomInput } from "./common/CustomInput";
import LoginWay from "./common/LoginWay";
import { AgreementConfirm, OptionWay } from "./common/common";

const SignIn = () => {
  const [formDetails, setFormDetails] = useState({
    loginId: "",
  });
  const searchParams = useSearchParams();
  let auth = searchParams.get("auth");
  const [error, setError] = useState(false);
  const submitHandler = async (e) => {
    e.preventDefault();
    setError(true);
    if (formDetails.loginId) {
      setLoading(true);
    }
  };
  return (
    <div>
      <div className="px-4">
        <h2 className="mt-3 text-2xl font-semibold text-black !leading-130">
          SignIn
        </h2>

        <form className="mt-8" onSubmit={(e) => submitHandler(e)}>
          <CustomInput
            placeholder="Phone number or Email"
            name="loginId"
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
          <CustomButton customClass="w-full !py-3.5 mt-7" isSubmit>
            Continue
          </CustomButton>
        </form>
        <OptionWay />
        <LoginWay />
        <AgreementConfirm />
        <Link
          href={`/sign-up?auth=${auth}`}
          className="transparent-green-border-button mb-5"
        >
          New Customer ? Sign up
        </Link>
      </div>
    </div>
  );
};

export default SignIn;

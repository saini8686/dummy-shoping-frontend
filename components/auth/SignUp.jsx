"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import useAuthStore from "../../store/useAuthStore";
import { CustomButton } from "../common/CustomButton";
import { CustomInput } from "./common/CustomInput";
import LoginWay from "./common/LoginWay";
import { AgreementConfirm, OptionWay } from "./common/common";

const SignUp = () => {
  const [formDetails, setFormDetails] = useState({
    loginId: "",
    address: "",
    number: "",
    refferCode: "",
    password: "",
  });
  const searchParams = useSearchParams();
  const router = useRouter();
  let auth = searchParams.get("auth");
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { signUpWithEmailPassword, loading, error: authError } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(true);

    if (
      formDetails.loginId &&
      formDetails.password &&
      formDetails.address &&
      formDetails.number.length === 10
    ) {
      try {
        setIsLoading(true);
        // Generate OTP and log it to console
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        console.log(`OTP for ${formDetails.loginId}: ${otp}`);

        await signUpWithEmailPassword(
          formDetails.loginId,
          formDetails.password
        );
        router.push(`/${auth}`);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="px-4">
      <h2 className="mt-6 text-2xl font-semibold text-black !leading-130">
        Sign Up
      </h2>

      <form className="mt-8" onSubmit={handleSubmit}>
        <CustomInput
          placeholder="Email"
          name="loginId"
          type="email"
          error={!formDetails.loginId && error}
          errorText="Email Is Required"
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
          placeholder="Password"
          name="password"
          type="password"
          error={!formDetails.password && error}
          errorText="Password Is Required"
          value={formDetails.password}
          onChange={(e) =>
            setFormDetails({
              ...formDetails,
              password: e.target.value,
            })
          }
        />

        <CustomInput
          customClass="mt-4"
          placeholder="Number"
          name="number"
          type="number"
          error={
            (!formDetails.number || formDetails.number.length !== 10) && error
          }
          errorText="Number is required OR must be 10 digit"
          value={formDetails.number}
          onChange={(e) =>
            setFormDetails({
              ...formDetails,
              number: e.target.value,
            })
          }
        />
        <CustomInput
          customClass="mt-4"
          placeholder="Address"
          name="address"
          type="text"
          error={!formDetails.address && error}
          errorText="Address Is Required"
          value={formDetails.address}
          onChange={(e) =>
            setFormDetails({
              ...formDetails,
              address: e.target.value,
            })
          }
        />

        {authError && <p className="text-red-500 mt-2">{authError}</p>}

        <CustomButton
          customClass="w-full !py-3.5 mt-7"
          isSubmit
          disabled={isLoading || loading}
        >
          {isLoading || loading ? "Loading..." : "Sign Up"}
        </CustomButton>
      </form>
      <OptionWay />
      <LoginWay />
      <AgreementConfirm />

      <Link
        href={`/sign-in?auth=${auth}`}
        className="transparent-green-border-button mb-5"
      >
        Already have an account? Sign In
      </Link>
    </div>
  );
};

export default SignUp;

"use client";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { CustomButton } from "../common/CustomButton";
import Icon from "../common/Icons";
import { CustomInput } from "./common/CustomInput";
import LoginWay from "./common/LoginWay";
import { AgreementConfirm, OptionWay } from "./common/common";
import useAuthStore from "../../store/useAuthStore";
import useOtpStore from "../../store/useOtpStore";
import OtpVerification from "./OtpVerification";

const SignUp = () => {
  const [formDetails, setFormDetails] = useState({
    loginId: "",
    address: "",
    refferCode: "",
    password: "",
    name: "",
  });
  const [isChecked, setIsChecked] = useState(false);
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  let auth = searchParams.get("auth");
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Get auth functions from Zustand store
  const {
    signUpWithEmailPassword,
    signInWithGoogle,
    loading: authLoading,
    error: authError,
  } = useAuthStore();

  // Get OTP functions from Zustand store
  const {
    sendOtp,
    loading: otpLoading,
    error: otpError,
    otpVerified,
    resetOtpState,
  } = useOtpStore();

  // Handle request OTP
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setError(true);

    if (
      formDetails.loginId &&
      formDetails.password &&
      formDetails.address &&
      formDetails.name
    ) {
      try {
        setIsLoading(true);
        // Check if loginId is an email
        const isEmail = formDetails.loginId.includes("@");

        if (isEmail) {
          // Send OTP to email
          const success = await sendOtp(formDetails.loginId);
          if (success) {
            setShowOtpVerification(true);
          }
        } else {
          // Show error for non-email login ID
          setError("Please use a valid email address");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Handle OTP verification success
  const handleOtpVerified = async () => {
    try {
      setIsLoading(true);

      // Prepare additional user data for Firestore
      const additionalData = {
        displayName: formDetails.name,
        address: formDetails.address,
        referralCode: formDetails.refferCode || "",
        signUpMethod: "email",
        registrationDate: new Date().toISOString(),
      };

      // Register with email and password after OTP verification
      await signUpWithEmailPassword(
        formDetails.loginId,
        formDetails.password,
        additionalData
      );

      // Reset OTP state
      resetOtpState();

      // Redirect to customer page
      router.push("/customer");
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle resend OTP
  const handleResendOtp = async () => {
    await sendOtp(formDetails.loginId);
  };

  // Handle cancel OTP verification
  const handleCancelOtp = () => {
    setShowOtpVerification(false);
    resetOtpState();
  };

  // Handle Google sign-in
  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      await signInWithGoogle();
      router.push("/customer");
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Show OTP verification screen if OTP has been sent
  if (showOtpVerification) {
    return (
      <OtpVerification
        email={formDetails.loginId}
        onOtpVerified={handleOtpVerified}
        onResendOtp={handleResendOtp}
        onCancel={handleCancelOtp}
      />
    );
  }

  return (
    <div className="px-4">
      <h2 className="mt-6 text-2xl font-semibold text-black !leading-130">
        Sign Up
      </h2>

      {/* Google Sign-in Button */}
      {/* <div className="mt-4">
        <CustomButton
          customClass="w-full gap-3 justify-center flex items-center !py-3.5"
          onClick={handleGoogleSignIn}
          disabled={isLoading}>
          <Icon icon="google" /> Sign up with Google
        </CustomButton>
      </div> */}

      <form className="mt-8" onSubmit={handleRequestOtp}>
        <CustomInput
          placeholder="Full Name"
          name="name"
          type="text"
          error={!formDetails.name && error}
          errorText="Name Is Required"
          value={formDetails.name}
          onChange={(e) =>
            setFormDetails({
              ...formDetails,
              name: e.target.value,
            })
          }
        />

        <CustomInput
          customClass="mt-4"
          placeholder="Email"
          name="loginId"
          type="text"
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
          placeholder="Address"
          name="address"
          type="text"
          error={!formDetails.address && error}
          errorText={"Address Is Required"}
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
            className="w-[18px] h-[18px] checked:bg-greens-900 checked:border-transparent accent-greens-900/50"
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

        {(authError || otpError) && (
          <p className="text-red-500 mt-2">{authError || otpError}</p>
        )}

        <CustomButton
          customClass="w-full !py-3.5 mt-7"
          isSubmit
          disabled={isLoading || authLoading || otpLoading}>
          {isLoading || authLoading || otpLoading ? "Loading..." : "Continue"}
        </CustomButton>
      </form>
      <OptionWay />
      <LoginWay />
      <AgreementConfirm />

      <Link
        href={`/sign-in?auth=${auth}`}
        className="transparent-green-border-button mb-5">
        Are you Customer ? Sign in
      </Link>
    </div>
  );
};

export default SignUp;

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

const SignIn = () => {
  const [formDetails, setFormDetails] = useState({
    email: "",
    password: "",
  });
  const searchParams = useSearchParams();
  const router = useRouter();
  let auth = searchParams.get("auth");
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Get auth functions from Zustand store
  const {
    signInWithEmailPassword,
    signInWithGoogle,
    loading,
    error: authError,
    userProfile,
  } = useAuthStore();

  // Handle sign in with email and password
  const submitHandler = async (e) => {
    e.preventDefault();
    setError(true);

    if (formDetails.email && formDetails.password) {
      try {
        setIsLoading(true);
        const { user, userProfile } = await signInWithEmailPassword(
          formDetails.email,
          formDetails.password
        );

        // If user has a role, redirect to appropriate dashboard
        if (userProfile && userProfile.role === "admin") {
          router.push("/admin");
        } else {
          router.push("/customer");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Handle Google sign-in
  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      const { user, userProfile } = await signInWithGoogle();

      // If user has a role, redirect to appropriate dashboard
      if (userProfile && userProfile.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/customer");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="px-4">
      <h2 className="mt-3 text-2xl font-semibold text-black !leading-130">
        Sign In
      </h2>

      {/* Google Sign-in Button */}
      <div className="mt-4">
        <CustomButton
          customClass="w-full gap-3 justify-center flex items-center !py-3.5"
          onClick={handleGoogleSignIn}
          disabled={isLoading}>
          <Icon icon="google" /> Sign in with Google
        </CustomButton>
      </div>

      <LoginWay />
      <OptionWay />

      <form onSubmit={submitHandler}>
        <CustomInput
          placeholder="Email"
          name="email"
          type="email"
          error={!formDetails.email && error}
          errorText="Email Is Required"
          value={formDetails.email}
          onChange={(e) =>
            setFormDetails({
              ...formDetails,
              email: e.target.value,
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

        <div className="flex justify-end mt-2">
          <Link href="/reset-password" className="text-greens-900 text-sm">
            Forgot Password?
          </Link>
        </div>

        {authError && <p className="text-red-500 mt-2">{authError}</p>}

        <CustomButton
          customClass="w-full !py-3.5 mt-7"
          isSubmit
          disabled={isLoading || loading}>
          {isLoading || loading ? "Loading..." : "Sign In"}
        </CustomButton>
      </form>

      <AgreementConfirm />

      <Link
        href={`/sign-up?auth=${auth}`}
        className="transparent-green-border-button mb-5">
        Don't have an account? Sign Up
      </Link>
    </div>
  );
};

export default SignIn;

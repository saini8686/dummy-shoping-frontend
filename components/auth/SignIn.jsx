"use client";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { CustomButton } from "../common/CustomButton";
import { CustomInput } from "./common/CustomInput";
import LoginWay from "./common/LoginWay";
import { AgreementConfirm, OptionWay } from "./common/common";
import { login, saveToken, isAuthenticated, authType } from '../../services/auth.service'; // Adjust the import path as necessary
import Cookies from 'js-cookie';
import { ToastContainer, toast } from "react-toastify";

const SignIn = () => {
  // useEffect(() => {
  //   // Clear all client-side cookies
  //   Object.keys(Cookies.get()).forEach((cookieName) => {
  //     Cookies.remove(cookieName);
  //   });

  //   // Also clear localStorage or sessionStorage if needed
  //   localStorage.clear();
  //   sessionStorage.clear();
  // }, []);
  const [formDetails, setFormDetails] = useState({
    email: "",
    password: "",
  });

  const searchParams = useSearchParams();
  const router = useRouter();
  const auth = searchParams.get("auth"); // e.g., 'admin', 'shopkeeper', 'customer'

  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    setError(false);

    const { email, password } = formDetails;

    if (!email || !password) {
      setError(true);
      return;
    }

    try {
      setIsLoading(true);
      const response = await login(email, password);

      if (response?.token && response?.userId && response?.userRole) {
        // ✅ Set cookies with secure options (for HTTPS in production)
        Cookies.set("token", response.token, { sameSite: "Lax", secure: true });
        Cookies.set("userId", response.userId.toString(), { sameSite: "Lax", secure: true });
        Cookies.set("userRole", response.userRole.toLowerCase(), { sameSite: "Lax", secure: true });

        const role = response.userRole.toLowerCase();
        console.log("User Role:", role, "auth type:", auth);
        
        if (auth === role) {
          toast.success("Login Successful");

          switch (role) {
            case "admin":
              router.push("/admin/dashboard");
              break;
            case "shopkeeper":
              router.push(`/shopkepper/product`);
              break;
            case "customer":
              router.push("/customer");
              break;
            default:
              router.push("/shopkepper/product");
          }
        } else {
          toast.warning("You are not authorized to access this page");
          Cookies.remove("token");
          Cookies.remove("userId");
          Cookies.remove("userRole");
          setError(true);
        }
      } else {
        toast.error("Invalid credentials");
        setError(true);
      }
    } catch (err) {
      console.error("Login Error:", err);
      toast.error(err.response.data.message || "An error occurred during login");
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="px-4">
      <h2 className="mt-6 text-2xl font-semibold text-black !leading-130">
        Sign In
      </h2>

      {/* Google Sign-in Button */}
      {/* <div className="mt-4">
        <CustomButton
          customClass="w-full gap-3 justify-center flex items-center !py-3.5"
          onClick={handleGoogleSignIn}
          disabled={isLoading}>
          <Icon icon="google" /> Sign in with Google
        </CustomButton>
      </div> */}
      <ToastContainer />
      <form className="mt-8" onSubmit={(e) => submitHandler(e)}>
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

        <CustomButton
          customClass="w-full !py-3.5 mt-7"
          isSubmit
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Sign In"}
        </CustomButton>
      </form>
      <OptionWay />
      <LoginWay />
      <AgreementConfirm />

      <Link
        href={`/sign-up?auth=${auth}`}
        className="transparent-green-border-button mb-5"
      >
        Don't have an account? Sign Up
      </Link>
    </div>
  );
};

export default SignIn;

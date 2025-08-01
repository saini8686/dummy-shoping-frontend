"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import Cookies from 'js-cookie';
import { ToastContainer, toast } from "react-toastify";

import useAuthStore from "../../store/useAuthStore";
import { register, verifyOtp, login } from "../../services/auth.service";
import { CustomButton } from "../common/CustomButton";
import { CustomInput } from "./common/CustomInput";
import LoginWay from "./common/LoginWay";
import { AgreementConfirm, OptionWay } from "./common/common";

const SignUp = () => {
  const [formDetails, setFormDetails] = useState({
    email: "",
    address: "",
    number: "",
    name: "",
    password: "",
    referralCode: "",
  });

  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [userId, setUserId] = useState('');
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();
  const auth = searchParams.get("auth");
  const referralCodeFromURL = searchParams.get("referralCode");

  const { loading, error: authError } = useAuthStore();

  useEffect(() => {
    // Clear all cookies and storage
    Object.keys(Cookies.get()).forEach((cookieName) => Cookies.remove(cookieName));
    localStorage.clear();
    sessionStorage.clear();

    // Set referral code from URL if exists
    if (referralCodeFromURL) {
      setFormDetails((prev) => ({
        ...prev,
        referralCode: referralCodeFromURL,
      }));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(false);

    const isValid =
      formDetails.name &&
      formDetails.email &&
      formDetails.password &&
      formDetails.address &&
      formDetails.referralCode &&
      formDetails.number.length === 10;

    if (!isValid) {
      setError(true);
      return;
    }

    try {
      setIsLoading(true);

      const data = {
        ...formDetails,
        userRole: auth || "customer",
        isShopkeeper: auth === "shopkepper",
        isAdmin: auth?.includes("admin") || false,
      };

      const response = await register(data);

      if (response?.userId) {
        toast.success("OTP sent to your phone/email!");
        setUserId(response.userId);
        setShowOtpInput(true);
      } else {
        toast.error("Registration failed.");
        setError(true);
      }
    } catch (err) {
      console.error("Registration error:", err);
      toast.error("Something went wrong.");
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async () => {
    if (!otp || otp.length !== 6) {
      toast.error("Enter a valid 6-digit OTP");
      return;
    }

    try {
      setIsLoading(true);
      const result = await verifyOtp({ userId, otp });

      if (result.userId === userId) {
        toast.success("OTP Verified!");

        const response = await login(formDetails.email, formDetails.password);
        if (response?.token && response?.userId && response?.userRole) {
          Cookies.set("token", response.token, { sameSite: "Lax", secure: true });
          Cookies.set("userId", response.userId.toString(), { sameSite: "Lax", secure: true });
          Cookies.set("userRole", response.userRole.toLowerCase(), { sameSite: "Lax", secure: true });
        }

        if (auth === "shopkepper") Cookies.set("userId", userId, { secure: true, sameSite: "Strict", expires: 7 });

        if (auth === "admin") router.push("/admin/dashboard");
        else if (auth === "shopkepper") router.push(`/shopkepper`);
        else if (auth === "customer") router.push(`/customer`);
        else router.push(`/sign-in?auth=${auth}`);
      } else {
        toast.error("Incorrect OTP");
      }
    } catch (err) {
      console.error("OTP verification failed", err);
      toast.error("Failed to verify OTP");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="px-4">
      <ToastContainer />
      {!showOtpInput && (<h2 className="mt-6 text-2xl font-semibold text-black !leading-130">Sign Up</h2>)}

      {!showOtpInput && (
        <form className="mt-8" onSubmit={handleSubmit}>
          <CustomInput
            placeholder="Name"
            name="name"
            type="text"
            error={!formDetails.name && error}
            errorText="Name is required"
            value={formDetails.name}
            onChange={(e) => setFormDetails({ ...formDetails, name: e.target.value })}
          />
          <CustomInput
            customClass="mt-4"
            placeholder="Email"
            name="email"
            type="email"
            error={!formDetails.email && error}
            errorText="Email is required"
            value={formDetails.email}
            onChange={(e) => setFormDetails({ ...formDetails, email: e.target.value })}
          />
          <CustomInput
            customClass="mt-4"
            placeholder="Password"
            name="password"
            type="password"
            error={!formDetails.password && error}
            errorText="Password is required"
            value={formDetails.password}
            onChange={(e) => setFormDetails({ ...formDetails, password: e.target.value })}
          />
          <CustomInput
            customClass="mt-4"
            placeholder="Number"
            name="number"
            type="number"
            error={(!formDetails.number || formDetails.number.length !== 10) && error}
            errorText="Number must be 10 digits"
            value={formDetails.number}
            onChange={(e) => setFormDetails({ ...formDetails, number: e.target.value })}
          />
          <CustomInput
            customClass="mt-4"
            placeholder="Address"
            name="address"
            type="text"
            error={!formDetails.address && error}
            errorText="Address is required"
            value={formDetails.address}
            onChange={(e) => setFormDetails({ ...formDetails, address: e.target.value })}
          />
         {auth === "customer" && <CustomInput
            customClass="mt-4"
            placeholder="Referral Code"
            name="referralCode"
            type="text"
            error={!formDetails.referralCode && error}
            errorText="Referral Code is required"
            value={formDetails.referralCode}
            onChange={(e) => setFormDetails({ ...formDetails, referralCode: e.target.value })}
          />}

          {authError && <p className="text-red-500 mt-2">{authError}</p>}

          <CustomButton
            customClass="w-full !py-3.5 mt-7"
            isSubmit
            disabled={isLoading || loading}
          >
            {isLoading || loading ? "Processing..." : "Sign Up"}
          </CustomButton>
        </form>
      )}

      {showOtpInput && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Enter OTP</h3>
          <CustomInput
            type="number"
            name="otp"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <CustomButton
            customClass="w-full !py-3.5 mt-4"
            onClick={handleOtpSubmit}
            disabled={isLoading}
          >
            {isLoading ? "Verifying..." : "Verify OTP"}
          </CustomButton>
        </div>
      )}

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

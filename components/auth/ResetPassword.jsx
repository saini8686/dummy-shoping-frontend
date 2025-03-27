"use client";
import { useState } from "react";
import { CustomButton } from "../common/CustomButton";
import { CustomInput } from "./common/CustomInput";
import useOtpStore from "@/store/useOtpStore";
import useAuthStore from "@/store/useAuthStore";
import OtpVerification from "./OtpVerification";
import { useRouter } from "next/navigation";
import Link from "next/link";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState("email"); // email, otp, password
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    sendOtp,
    verifyOtp,
    resetOtpState,
    loading: otpLoading,
    error: otpError,
  } = useOtpStore();
  const {
    resetPassword,
    loading: authLoading,
    error: authError,
  } = useAuthStore();

  const handleSendOtp = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Email is required");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const success = await sendOtp(email);
      if (success) {
        setStep("otp");
      }
    } catch (err) {
      setError("Failed to send OTP. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpVerified = async () => {
    setStep("password");
  };

  const handleResendOtp = async () => {
    try {
      await sendOtp(email);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancelOtp = () => {
    setStep("email");
    resetOtpState();
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!password) {
      setError("Password is required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      await resetPassword(email, password);
      resetOtpState();
      // Show success message and redirect to login page
      alert(
        "Password reset successfully! Please login with your new password."
      );
      router.push("/sign-in");
    } catch (err) {
      setError("Failed to reset password. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Render based on current step
  if (step === "otp") {
    return (
      <OtpVerification
        email={email}
        onOtpVerified={handleOtpVerified}
        onResendOtp={handleResendOtp}
        onCancel={handleCancelOtp}
      />
    );
  }

  return (
    <div className="px-4">
      <h2 className="mt-3 text-2xl font-semibold text-black !leading-130">
        {step === "email" ? "Reset Password" : "Create New Password"}
      </h2>

      {step === "email" ? (
        // Step 1: Enter email to receive OTP
        <form onSubmit={handleSendOtp} className="mt-6">
          <p className="text-gray-600 mb-4">
            Enter your email address and we'll send you a verification code to
            reset your password.
          </p>

          <CustomInput
            placeholder="Email Address"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!email && error}
            errorText="Email is required"
          />

          {error && <p className="text-red-500 mt-2">{error}</p>}
          {otpError && <p className="text-red-500 mt-2">{otpError}</p>}

          <CustomButton
            customClass="w-full !py-3.5 mt-6"
            isSubmit
            disabled={isLoading || otpLoading}>
            {isLoading || otpLoading ? "Sending..." : "Send Verification Code"}
          </CustomButton>

          <div className="mt-4 text-center">
            <Link href="/sign-in" className="text-greens-900 hover:underline">
              Back to Sign In
            </Link>
          </div>
        </form>
      ) : (
        // Step 3: Enter new password
        <form onSubmit={handleResetPassword} className="mt-6">
          <p className="text-gray-600 mb-4">
            Create a new password for your account.
          </p>

          <CustomInput
            placeholder="New Password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!password && error}
            errorText="Password is required"
          />

          <CustomInput
            customClass="mt-4"
            placeholder="Confirm Password"
            name="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={password !== confirmPassword && error}
            errorText="Passwords do not match"
          />

          {error && <p className="text-red-500 mt-2">{error}</p>}
          {authError && <p className="text-red-500 mt-2">{authError}</p>}

          <CustomButton
            customClass="w-full !py-3.5 mt-6"
            isSubmit
            disabled={isLoading || authLoading}>
            {isLoading || authLoading ? "Updating..." : "Reset Password"}
          </CustomButton>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => {
                setStep("email");
                resetOtpState();
              }}
              className="text-greens-900 hover:underline">
              Back to Email Entry
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ResetPassword;

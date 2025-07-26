"use client";

import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { CustomButton } from "../common/CustomButton";
import { CustomInput } from "./common/CustomInput";
import { verifyOtp, forgotPassword, resetPassword } from "../../services/auth.service"; // adjust paths

const ResetPassword = () => {
  const [step, setStep] = useState("request"); // 'request' | 'verify' | 'reset'
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");


  const handleRequestOtp = async () => {
    if (!email) {
      toast.error("Please enter your email or phone number");
      return;
    }

    try {
      setIsLoading(true);
      const res = await forgotPassword({ email });
      console.log("Response from forgotPassword:", res);

      if (res?.email) {
        toast.success("OTP sent successfully");
        setUserId(res.user);
        setEmail(res.email);
        setStep("verify");
      } else {
        toast.error("User not found");
      }
    } catch (err) {
      console.error("OTP send failed", err);
      toast.error("Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      setIsLoading(true);
      const res = await verifyOtp({ userId, otp });

      if (res?.userId === userId) {
        toast.success("OTP verified");
        setStep("reset");
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

  // const handleResetPassword = async () => {
  //   if (!newPassword || newPassword.length < 6) {
  //     toast.error("Password must be at least 6 characters");
  //     return;
  //   }

  //   try {
  //     setIsLoading(true);
  //     const res = await resetPassword({ email, otp, password: newPassword });

  //     if (res?.success) {
  //       toast.success("Password reset successfully");
  //       setStep("done");
  //     } else {
  //       toast.error("Failed to reset password");
  //     }
  //   } catch (err) {
  //     console.error("Reset password failed", err);
  //     toast.error("Something went wrong");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  const handleResetPassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setIsLoading(true);
      const res = await resetPassword({ email, otp, password: newPassword });

      if (res?.success) {
        toast.success("Password reset successfully");
        setStep("done");
      } else {
        toast.error("Failed to reset password");
      }
    } catch (err) {
      console.error("Reset password failed", err);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="mx-auto px-4 py-8">
      <ToastContainer />

      {step === "request" && (
        <>
          <h2 className="text-xl font-semibold mb-4">Reset Your Password</h2>
          <CustomInput
            type="email"
            name="email"
            placeholder="Enter email or phone"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <CustomButton
            customClass="w-full mt-4"
            onClick={handleRequestOtp}
            disabled={isLoading}
          >
            {isLoading ? "Sending OTP..." : "Send OTP"}
          </CustomButton>
        </>
      )}

      {step === "verify" && (
        <>
          <h2 className="text-xl font-semibold mb-4">Enter OTP</h2>
          <CustomInput
            type="number"
            name="otp"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <CustomButton
            customClass="w-full mt-4"
            onClick={handleVerifyOtp}
            disabled={isLoading}
          >
            {isLoading ? "Verifying..." : "Verify OTP"}
          </CustomButton>
        </>
      )}

      {step === "reset" && (
        <>
          <h2 className="text-xl font-semibold mb-4">Set New Password</h2>

          <CustomInput
            type="password"
            name="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <CustomInput
            customClass={"pt-3"}
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={confirmPassword && confirmPassword !== newPassword}
            errorText="Passwords do not match"
          />

          <CustomButton
            customClass="w-full mt-4"
            onClick={handleResetPassword}
            disabled={isLoading}
          >
            {isLoading ? "Resetting..." : "Reset Password"}
          </CustomButton>
        </>
      )}
      {step === "done" && (
        <>
          <h2 className="text-xl font-semibold mb-4 text-green-700">Password Updated</h2>
          <p className="mb-4">You can now log in with your new password.</p>
          <CustomButton
            customClass="w-full"
            onClick={() => window.location.href = "/sign-in"}
          >
            Go to Login
          </CustomButton>
        </>
      )}
    </div>
  );
};

export default ResetPassword;

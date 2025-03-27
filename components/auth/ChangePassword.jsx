"use client";
import { useState, useEffect } from "react";
import { CustomButton } from "../common/CustomButton";
import { CustomInput } from "./common/CustomInput";
import useAuthStore from "@/store/useAuthStore";
import useUserStore from "@/store/useUserStore";
import OtpVerification from "./OtpVerification";
import useOtpStore from "@/store/useOtpStore";
import { useRouter } from "next/navigation";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState("password"); // password, otp, complete
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const {
    user,
    updatePassword,
    loading: authLoading,
    error: authError,
  } = useAuthStore();
  const { userData } = useUserStore();
  const {
    sendOtp,
    verifyOtp,
    resetOtpState,
    loading: otpLoading,
    error: otpError,
  } = useOtpStore();

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      router.push("/sign-in");
    }
  }, [user, router]);

  const handleInitiatePasswordChange = async (e) => {
    e.preventDefault();

    if (!currentPassword) {
      setError("Current password is required");
      return;
    }

    if (!newPassword) {
      setError("New password is required");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (currentPassword === newPassword) {
      setError("New password must be different from current password");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      // Verify current password by reauthenticating user
      await updatePassword(currentPassword, null, true); // Just verify current password

      // Send OTP to user's email for verification
      const userEmail = userData?.email || user?.email;
      if (userEmail) {
        const success = await sendOtp(userEmail);
        if (success) {
          setStep("otp");
        } else {
          setError("Failed to send verification code. Please try again.");
        }
      } else {
        setError("Cannot find email address. Please contact support.");
      }
    } catch (err) {
      if (err.code === "auth/wrong-password") {
        setError("Current password is incorrect");
      } else {
        setError("Failed to verify current password. Please try again.");
        console.error(err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpVerified = async () => {
    setIsLoading(true);

    try {
      // Update password using the verified OTP
      await updatePassword(currentPassword, newPassword);
      setSuccess(true);
      setStep("complete");
      resetOtpState();
    } catch (err) {
      setError("Failed to update password. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      const userEmail = userData?.email || user?.email;
      if (userEmail) {
        await sendOtp(userEmail);
      } else {
        setError("Cannot find email address. Please contact support.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancelOtp = () => {
    setStep("password");
    resetOtpState();
  };

  if (!user) {
    return <div>Redirecting to login...</div>;
  }

  // Show OTP verification screen
  if (step === "otp") {
    return (
      <OtpVerification
        email={userData?.email || user?.email}
        onOtpVerified={handleOtpVerified}
        onResendOtp={handleResendOtp}
        onCancel={handleCancelOtp}
      />
    );
  }

  // Show success screen
  if (step === "complete") {
    return (
      <div className="px-4 py-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-green-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold text-black mb-2">
          Password Updated!
        </h2>
        <p className="text-gray-600 mb-6">
          Your password has been changed successfully.
        </p>
        <CustomButton
          customClass="w-full !py-3.5"
          onClick={() => router.push("/profile")}>
          Back to Profile
        </CustomButton>
      </div>
    );
  }

  // Show password change form
  return (
    <div className="px-4">
      <h2 className="mt-3 text-2xl font-semibold text-black !leading-130">
        Change Password
      </h2>

      <form onSubmit={handleInitiatePasswordChange} className="mt-6">
        <p className="text-gray-600 mb-4">
          Enter your current password and a new password to update your account.
        </p>

        <CustomInput
          placeholder="Current Password"
          name="currentPassword"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          error={!currentPassword && error}
          errorText="Current password is required"
        />

        <CustomInput
          customClass="mt-4"
          placeholder="New Password"
          name="newPassword"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          error={!newPassword && error}
          errorText="New password is required"
        />

        <CustomInput
          customClass="mt-4"
          placeholder="Confirm New Password"
          name="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={newPassword !== confirmPassword && error}
          errorText="Passwords do not match"
        />

        {error && <p className="text-red-500 mt-2">{error}</p>}
        {authError && <p className="text-red-500 mt-2">{authError}</p>}

        <CustomButton
          customClass="w-full !py-3.5 mt-6"
          isSubmit
          disabled={isLoading || authLoading || otpLoading}>
          {isLoading || authLoading || otpLoading
            ? "Processing..."
            : "Change Password"}
        </CustomButton>

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => router.push("/profile")}
            className="text-greens-900 hover:underline">
            Back to Profile
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;

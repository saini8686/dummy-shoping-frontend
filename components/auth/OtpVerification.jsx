"use client";
import { useState, useEffect } from "react";
import { CustomButton } from "../common/CustomButton";
import { CustomInput } from "./common/CustomInput";
import useOtpStore from "../../store/useOtpStore";

const OtpVerification = ({ email, onOtpVerified, onResendOtp, onCancel }) => {
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(120); // 2 minutes
  const [error, setError] = useState(false);
  const { verifyOtp, loading, error: otpError, clearError } = useOtpStore();

  // Start the timer when component mounts
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer]);

  // Format timer as MM:SS
  const formatTime = () => {
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  // Handle OTP verification
  const handleVerify = async (e) => {
    e.preventDefault();
    setError(true);

    if (otp) {
      const success = await verifyOtp(email, otp);
      if (success) {
        onOtpVerified();
      }
    }
  };

  // Handle resend OTP
  const handleResend = () => {
    setTimer(120); // Reset timer
    onResendOtp();
    clearError();
  };

  return (
    <div className="px-4 py-5">
      <h2 className="text-xl font-semibold text-black mb-4">
        Verify Your Email
      </h2>
      <p className="text-sm text-gray-600 mb-5">
        We've sent a 6-digit verification code to <strong>{email}</strong>
      </p>

      <form onSubmit={handleVerify}>
        <CustomInput
          placeholder="Enter 6-digit OTP"
          name="otp"
          type="text"
          maxLength={6}
          error={!otp && error}
          errorText="OTP is required"
          value={otp}
          onChange={(e) => {
            // Allow only digits
            if (/^\d*$/.test(e.target.value)) {
              setOtp(e.target.value);
            }
          }}
        />

        {otpError && <p className="text-red-500 text-sm my-2">{otpError}</p>}

        <div className="flex items-center justify-between my-4">
          <span className="text-sm">
            {timer > 0 ? (
              <>Time remaining: {formatTime()}</>
            ) : (
              <span className="text-red-500">Time expired</span>
            )}
          </span>
          <button
            type="button"
            className={`text-greens-900 text-sm ${
              timer > 0 ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={handleResend}
            disabled={timer > 0}>
            Resend OTP
          </button>
        </div>

        <div className="flex gap-3 mt-5">
          <CustomButton
            customClass="flex-1 !py-3"
            type="button"
            onClick={onCancel}>
            Cancel
          </CustomButton>
          <CustomButton customClass="flex-1 !py-3" isSubmit disabled={loading}>
            {loading ? "Verifying..." : "Verify OTP"}
          </CustomButton>
        </div>
      </form>
    </div>
  );
};

export default OtpVerification;

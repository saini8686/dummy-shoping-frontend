"use client";
import { CustomButton } from "@/components/common/CustomButton";
import OtpInput from "@/components/common/OtpInput";
import { useRouter } from "next/navigation";
import { useState } from "react";

const OtpVerfify = () => {
  const [otp, setOtp] = useState("");
  const router = useRouter();
  const [error, setError] = useState(false);
  const OTP_LENGTH = 5;
  const handleOtpChange = (value) => {
    setOtp(value);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (otp.length != OTP_LENGTH) {
      console.log("error");
      setError(true);
    } else {
      console.log("Submitted OTP:", otp);
      router.push("/shopkepper/wallet/withdrawal?withdraw=success");

      setError(false);
    }
  };
  return (
    <div>
      <h2 className="text-xl  font-medium text-blacks-200">Please enter pin</h2>
      <form onSubmit={handleSubmit} className="w-full">
        <OtpInput length={OTP_LENGTH} onChange={handleOtpChange} />
        {error && otp.length != 5 && (
          <p className="text-red-500 text-sm mt-2">Please enter the full OTP</p>
        )}
        <CustomButton isSubmit customClass="w-full mt-10">
          Withdraw
        </CustomButton>
      </form>
    </div>
  );
};

export default OtpVerfify;

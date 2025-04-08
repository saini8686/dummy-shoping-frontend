"use client";
import { CustomInput } from "@/components/auth/common/CustomInput";
import { CustomButton } from "@/components/common/CustomButton";
import Icon from "@/components/common/Icons";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import OtpVerfify from "./OtpVerfify";
import Success from "./Success";

const Withdrawal = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  let withdraw = searchParams.get("withdraw");
  const [formDetails, setFormDetails] = useState({
    amount: "",
  });
  const [error, setError] = useState(false);
  const submitHandler = (e) => {
    e.preventDefault();
    if (formDetails.amount) {
      router.push("/shopkepper/wallet/withdrawal?withdraw=otp-verify");
      console.log(formDetails, "formDetails formDetails");
      setError(false);
      setFormDetails({
        amount: "",
      });
    } else {
      setError(true);
    }
  };
  return withdraw === "otp-verify" ? (
    <OtpVerfify />
  ) : withdraw === "success" ? (
    <Success />
  ) : (
    <form onSubmit={(e) => submitHandler(e)}>
      <CustomInput
        placeholder="Amount"
        name="amount"
        type="number"
        error={!formDetails.amount && error}
        errorText="Amount Is Required"
        value={formDetails.amount}
        onChange={(e) =>
          setFormDetails({
            ...formDetails,
            amount: e.target.value,
          })
        }
      />
      <div className="w-full flex justify-between cursor-pointer items-center border mt-3 border-[#C4C4C4] rounded-lg p-3">
        <p>
          <span className="text-greys-dark-400 text-base block !leading-130">
            Access Bank
          </span>
          <span className="text-greys-dark-400 block text-sm !leading-130">
            Lorem ipsum dolor
          </span>
        </p>
        <span className="rotate-180 opacity-30">
          <Icon icon="back" />
        </span>
      </div>
      <Link
        href="#"
        className="text-greens-900 flex items-center gap-2 mt-10 text-base font-normal !leading-130 hover:text-black duration-300"
      >
        <Icon icon="plusCart" />
        Add Bank
      </Link>
      <CustomButton isSubmit customClass="w-full mt-10">
        Withdraw
      </CustomButton>
    </form>
  );
};

export default Withdrawal;

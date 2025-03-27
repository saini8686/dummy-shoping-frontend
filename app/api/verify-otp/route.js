import { NextResponse } from "next/server";
import { otpStore } from "../send-otp/route";

export async function POST(request) {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json(
        { error: "Email and OTP are required" },
        { status: 400 }
      );
    }

    // Get stored OTP data
    const otpData = otpStore.get(email);

    // Check if OTP exists and is valid
    if (!otpData) {
      return NextResponse.json(
        { error: "OTP not found or expired. Please request a new one." },
        { status: 400 }
      );
    }

    // Check if OTP is expired
    if (Date.now() > otpData.expiresAt) {
      otpStore.delete(email); // Remove expired OTP
      return NextResponse.json(
        { error: "OTP has expired. Please request a new one." },
        { status: 400 }
      );
    }

    // Check if OTP matches
    if (otpData.otp !== otp) {
      return NextResponse.json(
        { error: "Invalid OTP. Please try again." },
        { status: 400 }
      );
    }

    // OTP is valid, remove it from the store (one-time use)
    otpStore.delete(email);

    return NextResponse.json(
      { message: "OTP verified successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return NextResponse.json(
      { error: "Failed to verify OTP" },
      { status: 500 }
    );
  }
}

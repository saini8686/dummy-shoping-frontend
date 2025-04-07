"use client";
import { useState } from "react";
import { CustomButton } from "../common/CustomButton";
import { CustomInput } from "./common/CustomInput";
import useAuthStore from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import Link from "next/link";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const {
    resetPassword,
    loading: authLoading,
    error: authError,
  } = useAuthStore();

  // Function to check if user exists in Firestore
  const checkUserExists = async (email) => {
    try {
      // Import Firebase directly in component
      const { getFirestore, collection, query, where, getDocs } = await import(
        "firebase/firestore"
      );
      const { db } = await import("@/app/firebase/config");

      console.log("Checking if user exists:", email);
      console.log("Firebase db initialized:", !!db);

      // Query Firestore users collection
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", email));

      console.log("Query created, attempting to fetch documents");
      const querySnapshot = await getDocs(q);

      const exists = !querySnapshot.empty;
      console.log("User exists:", exists);

      // Return true if user exists, false otherwise
      return exists;
    } catch (error) {
      console.error("Error checking user existence:", error);
      // Return false instead of throwing error to gracefully handle the issue
      return false;
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Email is required");
      return;
    }

    setError("");
    setIsLoading(true);
    setSuccess(false);

    try {
      console.log("Starting password reset process for:", email);

      let userExists = false;
      try {
        // Check if user exists using our local function
        userExists = await checkUserExists(email);
      } catch (checkError) {
        console.error("Error during user check:", checkError);
        // Continue anyway since Firebase Auth will also validate the email
      }

      if (!userExists) {
        console.log("User check failed or user doesn't exist");
        // We'll still try to send a reset email through Firebase Auth
        // Firebase will handle non-existent users gracefully
      }

      // Send password reset email via Firebase Auth
      console.log("Sending password reset email");
      await resetPassword(email);
      console.log("Password reset email sent successfully");
      setSuccess(true);
    } catch (err) {
      console.error("Password reset error:", err);

      // Provide better error messages
      if (err.message?.includes("fetch")) {
        setError(
          "Network error. Please check your internet connection and try again."
        );
      } else if (err.code === "auth/user-not-found") {
        setError(
          "No account found with this email. Please check your email or sign up."
        );
      } else if (err.code === "auth/invalid-email") {
        setError("Invalid email format. Please enter a valid email address.");
      } else if (err.code === "auth/network-request-failed") {
        setError(
          "Network error. Please check your internet connection and try again."
        );
      } else {
        setError(
          err.message || "Failed to send reset email. Please try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="px-4">
      <h2 className="mt-3 text-2xl font-semibold text-black !leading-130">
        Reset Password
      </h2>

      {success ? (
        <div className="mt-6 text-center">
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
          <h3 className="text-xl font-semibold text-black mb-2">
            Check Your Email
          </h3>
          <p className="text-gray-600 mb-6">
            We've sent a password reset link to <strong>{email}</strong>. Please
            check your email and follow the instructions to reset your password.
          </p>
          <CustomButton
            customClass="w-full !py-3.5"
            onClick={() => router.push("/sign-in")}>
            Back to Sign In
          </CustomButton>
        </div>
      ) : (
        <form onSubmit={handleResetPassword} className="mt-6">
          <p className="text-gray-600 mb-4">
            Enter your email address and we'll send you a link to reset your
            password.
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
          {authError && <p className="text-red-500 mt-2">{authError}</p>}

          <CustomButton
            customClass="w-full !py-3.5 mt-6"
            isSubmit
            disabled={isLoading || authLoading}>
            {isLoading || authLoading ? "Sending..." : "Send Reset Link"}
          </CustomButton>

          <div className="mt-4 text-center">
            <Link href="/sign-in" className="text-greens-900 hover:underline">
              Back to Sign In
            </Link>
          </div>
        </form>
      )}
    </div>
  );
};

export default ResetPassword;

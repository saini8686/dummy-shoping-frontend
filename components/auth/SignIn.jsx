"use client";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { CustomButton } from "../common/CustomButton";
import { CustomInput } from "./common/CustomInput";
import LoginWay from "./common/LoginWay";
import { AgreementConfirm, OptionWay } from "./common/common";
import { login } from "../../services/auth.service";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";

const SignIn = () => {
  const [formDetails, setFormDetails] = useState({ email: "", password: "" });
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();
  const auth = searchParams.get("auth"); // e.g., 'admin', 'shopkeeper', 'customer'

  // ✅ Auto-login if already authenticated
  useEffect(() => {
    const token = Cookies.get("token");
    const userRole = Cookies.get("userRole");

    if (token && userRole) {
      switch (userRole.toLowerCase()) {
        case "admin":
          router.replace("/admin/user-list");
          break;
        case "shopkeeper":
          router.replace("/shopkepper/product");
          break;
        case "customer":
          router.replace("/customer");
          break;
        default:
          router.replace("/");
      }
    }
  }, [router]);

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
        // Only allow approved accounts for admin/shopkeeper
        if (
          (response.userRole === "admin" || response.userRole === "shopkeeper") &&
          response.status !== "approved"
        ) {
          toast.error("Your account is not active. Please contact support.");
          return;
        }

        // ✅ Store credentials in cookies
        Cookies.set("token", response.token, { sameSite: "Lax", secure: true });
        Cookies.set("userId", response.userId.toString(), { sameSite: "Lax", secure: true });
        Cookies.set("userRole", response.userRole.toLowerCase(), { sameSite: "Lax", secure: true });

        const role = response.userRole.toLowerCase();

        if (auth === role) {
          toast.success("Login Successful");

          switch (role) {
            case "admin":
              router.push("/admin/user-list");
              break;
            case "shopkeeper":
              router.push("/shopkepper/product");
              break;
            case "customer":
              router.push("/customer");
              break;
            default:
              router.push("/");
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
      toast.error(err?.response?.data?.message || "An error occurred during login");
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Logout function
  const logout = () => {
    Cookies.remove("token");
    Cookies.remove("userId");
    Cookies.remove("userRole");
    router.push(`/sign-in?auth=${auth || "customer"}`);
  };

  return (
    <div className="px-4">
      <h2 className="mt-6 text-2xl font-semibold text-black !leading-130">Sign In</h2>
      <ToastContainer />

      <form className="mt-8" onSubmit={submitHandler}>
        <CustomInput
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

        <div className="flex justify-end mt-2">
          <Link href="/reset-password" className="text-greens-900 text-sm">
            Forgot Password?
          </Link>
        </div>

        <CustomButton customClass="w-full !py-3.5 mt-7" isSubmit disabled={isLoading}>
          {isLoading ? "Loading..." : "Sign In"}
        </CustomButton>
      </form>

      <OptionWay />
      <LoginWay />
      <AgreementConfirm />

      <Link href={`/sign-up?auth=${auth}`} className="transparent-green-border-button mb-5">
        Don't have an account? Sign Up
      </Link>

      {/* Optional Logout button */}
      {Cookies.get("token") && (
        <button
          onClick={logout}
          className="px-4 py-2 bg-red-500 text-white rounded mt-4"
        >
          Logout
        </button>
      )}
    </div>
  );
};

export default SignIn;

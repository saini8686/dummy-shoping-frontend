"use client";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { CustomButton } from "../common/CustomButton";
import { CustomInput } from "./common/CustomInput";
import LoginWay from "./common/LoginWay";
import { AgreementConfirm, OptionWay } from "./common/common";
import { login } from '../../services/auth.service';
import Cookies from 'js-cookie';
import { ToastContainer, toast } from "react-toastify";

const SignIn = () => {
  const [formDetails, setFormDetails] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();
  const auth = searchParams.get("auth"); // e.g., 'admin', 'shopkeeper', 'customer'

  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [address, setAddress] = useState(false);

  // ✅ Redirect if already logged in
  // useEffect(() => {
  //   const token = Cookies.get("token");
  //   const userRole = Cookies.get("userRole");

  //   if (token) {
  //     switch (userRole.toLowerCase()) {
  //       case "admin":
  //         router.replace("/admin/user-list");
  //         break;
  //       case "shopkeeper":
  //         router.replace("/shopkepper/product");
  //         break;
  //       case "customer":
  //         router.replace("/customer");
  //         break;
  //       default:
  //         router.replace("/");
  //     }
  //   }
  // }, []);

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
        if (
          (response?.userRole === "admin" || response?.userRole === "shopkeeper") &&
          response?.status !== "approved"
        ) {
          toast.error("Your account is not active. Please contact support.");
          return;
        }
        Cookies.set("token", response.token, { sameSite: "Lax", secure: true });
        Cookies.set("userId", response.userId.toString(), { sameSite: "Lax", secure: true });
        Cookies.set("userRole", response.userRole.toLowerCase(), { sameSite: "Lax", secure: true });

        const role = response.userRole.toLowerCase();
        console.log("User Role:", role, "auth type:", auth);

        if (auth === role) {
          toast.success("Login Successful");

          switch (role) {
            case "admin":
              router.push("/admin/user-list");
              break;
            case "shopkeeper":
              router.push(`/shopkepper/product`);
              break;
            case "customer":
              await getLocation();
              router.push("/customer");
              break;
            default:
              router.push("/shopkepper/product");
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

  const getLocation = () => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        alert('Geolocation is not supported by your browser');
        setDefaultLocation();
        resolve();
        return;
      }

      setLoading(true);

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
            );
            const data = await response.json();

            const { house_number, road, suburb, city, town, village, state, postcode, country } = data.address;

            const fullAddress = `
              ${house_number ? house_number + ', ' : ''}${road ? road + ', ' : ''}${suburb ? suburb + ', ' : ''}
              ${city || town || village ? (city || town || village) + ', ' : ''}
              ${state ? state + ', ' : ''}${country ? country + ', ' : ''}${postcode ? postcode : ''}
            `.replace(/\s+/g, ' ').trim();

            document.cookie = `latitude=${latitude}; path=/`;
            document.cookie = `longitude=${longitude}; path=/`;
            document.cookie = `address=${encodeURIComponent(fullAddress)}; path=/`;

            setAddress(fullAddress || 'Address not found');
          } catch (err) {
            console.error('Reverse geocode failed:', err);
            setAddress('Address not found');
          }

          setLoading(false);
          resolve();
        },
        (error) => {
          console.error(error);
          alert('Unable to retrieve your location, setting default.');
          setDefaultLocation();
          setLoading(false);
          resolve();
        }
      );
    });
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
          errorText="Email Is Required"
          value={formDetails.email}
          onChange={(e) =>
            setFormDetails({
              ...formDetails,
              email: e.target.value,
            })
          }
        />

        <CustomInput
          customClass="mt-4"
          placeholder="Password"
          name="password"
          type="password"
          error={!formDetails.password && error}
          errorText="Password Is Required"
          value={formDetails.password}
          onChange={(e) =>
            setFormDetails({
              ...formDetails,
              password: e.target.value,
            })
          }
        />

        <div className="flex justify-end mt-2">
          <Link href="/reset-password" className="text-greens-900 text-sm">
            Forgot Password?
          </Link>
        </div>

        <CustomButton
          customClass="w-full !py-3.5 mt-7"
          isSubmit
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Sign In"}
        </CustomButton>
      </form>

      <OptionWay />
      <LoginWay />
      <AgreementConfirm />

      <Link
        href={`/sign-up?auth=${auth}`}
        className="transparent-green-border-button mb-5"
      >
        Don't have an account? Sign Up
      </Link>
    </div>
  );
};

export default SignIn;

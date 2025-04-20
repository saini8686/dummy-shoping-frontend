"use client";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { CustomButton } from "../common/CustomButton";
import { CustomInput } from "./common/CustomInput";
import LoginWay from "./common/LoginWay";
import { AgreementConfirm, OptionWay } from "./common/common";
import { login, saveToken, isAuthenticated, authType } from '../../services/auth.service'; // Adjust the import path as necessary
import { toast } from "react-toastify";


const SignIn = () => {
  const [formDetails, setFormDetails] = useState({
    email: "",
    password: "",
  });
  const searchParams = useSearchParams();
  const router = useRouter();
  let auth = searchParams.get("auth");
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    setError(false);
  
    if (!formDetails.email || !formDetails.password) {
      setError(true);
      return;
    }
  
    try {
      setIsLoading(true);
      let response = await login(formDetails.email, formDetails.password);
      if (response.token) {
        saveToken(response.token);
        localStorage.setItem('token', response.token);
        console.log(authType(), 'authType');
        
        if(isAuthenticated()){
          if(auth === authType()){
            toast.success('Login Successful');
            
            if(authType() === 'shopkepper'){
              router.push(`/${auth}/product`);
            }else{
              console.log(`/${auth}/product`,'user authType matched');
              router.push(`/${auth}`);
            }
          }else {
            toast.warning('Auth type not matched');            
            localStorage.removeItem('token');            
            setError(true);
          }        
        }
      }else {
        setError(true);
      }
    } catch (err) {
      console.error('Error:', err);
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="px-4">
      <h2 className="mt-6 text-2xl font-semibold text-black !leading-130">
        Sign In
      </h2>

      {/* Google Sign-in Button */}
      {/* <div className="mt-4">
        <CustomButton
          customClass="w-full gap-3 justify-center flex items-center !py-3.5"
          onClick={handleGoogleSignIn}
          disabled={isLoading}>
          <Icon icon="google" /> Sign in with Google
        </CustomButton>
      </div> */}

      <form className="mt-8" onSubmit={(e) => submitHandler(e)}>
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

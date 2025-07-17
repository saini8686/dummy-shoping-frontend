import { Cookie } from "lucide-react";
import { redirect } from "next/dist/server/api-utils";

// Local storage based authentication service
const AUTH_KEY = 'auth_user';
const OTP_KEY = 'auth_otp';

export const generateOTP = () => {
  // Generate a 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  localStorage.setItem(OTP_KEY, otp);
  return otp;
};

export const verifyOTP = (inputOTP) => {
  const storedOTP = localStorage.getItem(OTP_KEY);
  return storedOTP === inputOTP;
};

export const registerUser = (userData) => {
  localStorage.setItem(AUTH_KEY, JSON.stringify(userData));
  return true;
};

export const getCurrentUser = () => {
  const userData = localStorage.getItem(AUTH_KEY);
  return userData ? JSON.parse(userData) : null;
};

export const logout = () => {
  localStorage.removeItem(AUTH_KEY);
  Cookie.removeItem("token"); // Assuming you use cookies for session management
  redirect('/sign-in?auth='); // Redirect to login page after logout
};
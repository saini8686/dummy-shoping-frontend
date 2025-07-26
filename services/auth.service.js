import api from './axiosInstance.service';
import Cookies from 'js-cookie';
import { decodeToken } from '../utils/jwt';

const TOKEN_KEY = 'token';

// LOGIN
export const login = async (email, password) => {
  const res = await api.post('/auth/login', { email, password });
  return res.data;
};

// REGISTER
export const register = async (data) => {
  const res = await api.post('/auth/register', data);
  return res.data;
};

export const verifyOtp = async (data) => {
  const res = await api.post('/api/verify-otp', data);
  return res.data;
};

export const reVerifyOtp = async (data) => {
  const res = await api.post('/api/reverify-otp', data);
  return res.data;
};

export const forgotPassword = async (data) => {
  const res = await api.post('/auth/forgot-password', data);
  return res.data;
};

export const sendResetOtp = async (data) => {
  const res = await api.post('/auth/resend-otp', data);
  return res.data;
};

export const resetPassword = async (data) => {
  const res = await api.post('/auth/reset-password', data);
  return res.data;
};

// SAVE TOKEN IN COOKIE
export const saveToken = (token) => {
  Cookies.set(TOKEN_KEY, token, { secure: true, sameSite: 'Strict', expires: 7 }); // Expires in 7 days
};

// GET TOKEN FROM COOKIE
export const getToken = () => {
  return Cookies.get(TOKEN_KEY);
};

// REMOVE TOKEN FROM COOKIE
export const removeToken = () => {
  Cookies.remove(TOKEN_KEY);
};

// DECODE TOKEN TO GET USER INFO
export const getUserFromToken = () => {
  const token = getToken();
  console.log(token, "token in auth service");
  
  if (!token) return null;
  return decodeToken(token);
};

// CHECK IF USER IS AUTHENTICATED
export const isAuthenticated = () => {
  const user = getUserFromToken();
  return !!user;
};

// GET AUTH TYPE FROM TOKEN
export const authType = () => {
  return getUserFromToken()?.authType;
};

// GET USER ID FROM TOKEN
export const getUserId = () => {
  return getUserFromToken()?.userId;
};

// CHECK IF USER IS ADMIN
export const isAdmin = () => {
  return getUserFromToken()?.isAdmin;
};

export const logout = () => {
  const userRole = Cookies.get("userRole");

  // Remove cookies
  Cookies.remove("token");
  Cookies.remove("userId");
  Cookies.remove("userRole");

  // Redirect based on role
  switch (userRole) {
    case "admin":
      window.location.href = "/sign-in?auth=admin";
      break;
    case "shopkeeper":
      window.location.href = "/sign-in?auth=shopkeeper";
      break;
    case "customer":
      window.location.href = "/sign-in?auth=customer";
      break;
    default:
      window.location.href = "/sign-in";
      break;
  }
};
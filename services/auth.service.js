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

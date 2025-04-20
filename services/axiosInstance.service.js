import axios from 'axios';
import { getToken } from './auth.service'
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? getToken() : null;
  console.log(getToken(),"token");
  console.log(token,"token");
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;

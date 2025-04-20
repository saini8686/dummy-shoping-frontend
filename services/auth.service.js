import api from './axiosInstance.service';
import { decodeToken } from '../utils/jwt';

const TOKEN_KEY = 'token';

export const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    return res.data;
};

export const register = async (data) => {
    const res = await api.post('/auth/register', data);
    return res.data;
};

export const saveToken = (token) => {
    localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = () => {
    return localStorage.getItem(TOKEN_KEY);
};

export const removeToken = () => {
    localStorage.removeItem(TOKEN_KEY);
};

export const getUserFromToken = () => {
    const token = getToken();
    if (!token) return null;
    return decodeToken(token);
};

export const isAuthenticated = () => {
    const user = getUserFromToken();
    return !!user;
};

export const authType = () => {
    return getUserFromToken().authType;
};

export const getUserId = () => {
    return getUserFromToken().userId;
};

export const isAdmin = () => {
    return getUserFromToken().isAdmin;
};
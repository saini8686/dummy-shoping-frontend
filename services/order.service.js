import api from './axiosInstance.service';
import Cookies from 'js-cookie';


const token = Cookies.get("token");

export const getAllOrdes = async (data) => {
    const response = await api.get('/api/orders', data);
    return response.data;
};

export const createOrder = async (data) => {
    const response = await api.post('/api/orders', data);
    return response.data;
};
export const getOrderById = async (id) => {
    const response = await api.get(`/api/orders/${id}`);
    return response.data;
}
// UPDATE product
export const updateProduct = async (id, data) => {
    const response = await api.put(`/api/orders/${id}`, data);
    return response.data;
};

// DELETE product
export const deleteProduct = async (id) => {
    const response = await api.delete(`/api/orders/${id}`);
    return response.data;
};
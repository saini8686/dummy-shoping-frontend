import api from './axiosInstance.service';
import Cookies from 'js-cookie';


const token = Cookies.get("token");

export const getAllWithdrawal = async () => {
    const response = await api.get('/api/transaction', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const createWithdrawal = async (data) => {
    const response = await api.post('/api/transaction', data, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};
export const getWithdrawalById = async (id) => {
    const response = await api.get(`/api/transaction/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
}
// UPDATE product
export const updateWithdrawal = async (id, data) => {
    const response = await api.put(`/api/transaction/${id}`, data, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

// DELETE product
export const deleteWithdrawal = async (id) => {
    const response = await api.delete(`/api/transaction/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};
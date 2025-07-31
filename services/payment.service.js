import api from './axiosInstance.service';
import Cookies from 'js-cookie';


const token = Cookies.get("token");
// GET all Payment
export const getAllPayments = async () => {
  const res = await api.get(`/api/payments`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

// GET single Payment by ID
export const getPaymentById = async (id) => {
  const response = await api.get(`/api/payment/${id}`);
  return response.data;
};

export const getPaymenttByUserId = async (id) => {
  const response = await api.get(`/api/payment/user/${id}`);
  return response.data;
};

// CREATE Payment
export const createPayment = async (data) => {
  const response = await api.post('/api/payment', data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};


// UPDATE Payment
export const updatePayment = async (userId, data) => {
  const response = await api.put(`/api/payment/${userId}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  },);
  return response.data;
};

// DELETE Payment
export const deleteProduct = async (id) => {
  const response = await api.delete(`/api/payment/${id}`);
  return response.data;
};

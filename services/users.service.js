import api from './axiosInstance.service';
import Cookies from 'js-cookie';

var userId = Cookies.get("userId");

export const submitUser = async (details) => {
  const res = await api.post('/api/users', details);
  return res.data;
};

// READ: Get all basic details or by userId
export const getAllUserList = async () => {
  const token = Cookies.get("token"); // Get token from browser cookies

  const res = await api.get(`/api/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};
export const getUser = async (user_Id, token) => {
  console.log("Fetching user with ID:", user_Id);
  console.log("Using token:", token);
  
  const res = await api.get(`/api/users /${user_Id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// UPDATE: Update basic details by userId
export const updateUser = async (updatedDetails) => {
  const res = await api.put(`/api/users/${userId}`, updatedDetails);
  return res.data;
};

// DELETE: Delete basic details by userId
export const deleteUser = async () => {
  const res = await api.delete(`/api/users/${userId}`);
  return res.data;
};
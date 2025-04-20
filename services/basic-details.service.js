import api from './axiosInstance.service';

var userId = localStorage.getItem("userId");

export const submitBasicDetails = async (details) => {
    const res = await api.post('/api/basic-details', details);
    return res.data;
  };
  
  // READ: Get all basic details or by userId
  export const getBasicDetails = async () => {
    const res = await api.get(`/api/basic-details/${userId}`);
    return res.data;
  };
  
  // UPDATE: Update basic details by userId
  export const updateBasicDetails = async (updatedDetails) => {
    const res = await api.put(`/api/basic-details/${userId}`, updatedDetails);
    return res.data;
  };
  
  // DELETE: Delete basic details by userId
  export const deleteBasicDetails = async () => {
    const res = await api.delete(`/api/basic-details/${userId}`);
    return res.data;
  };
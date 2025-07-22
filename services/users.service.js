import { userData } from '@/utils/helper';
import api from './axiosInstance.service';
import Cookies from 'js-cookie';


export const submitUser = async (details) => {
  const res = await api.post('/api/users', details);
  return res.data;
};

// READ: Get all basic details or by userId
export const getAllUserList = async () => { // Get token from browser cookies
const token = Cookies.get("token");
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
  
  const res = await api.get(`/api/users/${user_Id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// UPDATE: Update basic details by userId
export const updateUser = async (updatedDetails) => {
  const token = Cookies.get("token");
  console.log("Updating user with details:", updatedDetails);
  console.log("Using token:", token);
  const res = await api.put(
    `/api/users/${updatedDetails.userId}`,
    updatedDetails,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};


// DELETE: Delete basic details by userId
export const deleteUser = async () => {
  const res = await api.delete(`/api/users/${userId}`);
  return res.data;
};

export const uploadImageToServer = async (file, userId, type = "user", columnName) => {
  const formData = new FormData();
  formData.append("file", file);     // must match multer field name
  formData.append("id", userId);     // required for backend to know which user
  formData.append("type", type);     // e.g., user, payment, etc.
  formData.append("columnName", columnName);     // e.g., user, payment, etc.

  try {
    const res = await api.post(`/api/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
    });

    console.log("Image upload response:", res);

    // Axios automatically parses JSON
    return res;
  } catch (err) {
    console.error("Image upload failed:", err);
    throw new Error("Image upload failed");
  }
};
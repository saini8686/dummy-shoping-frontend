import api from './axiosInstance.service';
// GET all products
export const getAllProducts = async () => {
  const response = await api.get('/api/products');
  return response.data;
};

// GET single product by ID
export const getProductById = async (id) => {
  const response = await api.get(`/api/products/${id}`);
  return response.data;
};

export const getProductByUserId = async () => {
  const response = await api.get(`/api/products/user/${1}`);
  return response.data;
};

// CREATE product
export const createProduct = async (data) => {
  const response = await api.post('/api/products', data);
  return response.data;
};

// UPDATE product
export const updateProduct = async (id, data) => {
  const response = await api.put(`/api/products/${id}`, data);
  return response.data;
};

// DELETE product
export const deleteProduct = async (id) => {
  const response = await api.delete(`/api/products/${id}`);
  return response.data;
};

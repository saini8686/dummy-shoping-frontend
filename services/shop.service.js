    import api from './axiosInstance.service';

export const getShopDetails = async (search = "", page = 1, limit = 10) => {
  const res = await api.get(`/api/shops`, {
    params: {
      search,
      page,
      limit,
    },
  });
  return res.data;
};

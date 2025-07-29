import api from './axiosInstance.service';

export const getBasicDetails = async (search = "", page = 1, limit = 100) => {
  const res = await api.get(`/api/shops`, {
    params: {
      search,
      page,
      limit,
    },
  });
  return res.data;
};

import api from './api';

export const userService = {
  getAllUsers: async (page = 0, size = 10) => {
    const response = await api.get(`/users?page=${page}&size=${size}`);
    return response.data;
  },

  getUserById: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/users/me');
    return response.data;
  },

  getDirectReports: async (managerId) => {
    const response = await api.get(`/users/${managerId}/direct-reports`);
    return response.data;
  },

  createUser: async (userData) => {
    const response = await api.post('/users', userData);
    return response.data;
  },

  updateUser: async (id, userData) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },

  deleteUser: async (id) => {
    await api.delete(`/users/${id}`);
  },

  deactivateUser: async (id) => {
    const response = await api.patch(`/users/${id}/deactivate`);
    return response.data;
  },
};


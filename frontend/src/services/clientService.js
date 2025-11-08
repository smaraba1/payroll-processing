import api from './api';

export const clientService = {
  getAllClients: async (page = 0, size = 10) => {
    const response = await api.get(`/clients?page=${page}&size=${size}`);
    return response.data;
  },

  getClientById: async (id) => {
    const response = await api.get(`/clients/${id}`);
    return response.data;
  },

  searchClients: async (name, page = 0, size = 10) => {
    const response = await api.get(`/clients/search?name=${name}&page=${page}&size=${size}`);
    return response.data;
  },

  createClient: async (clientData) => {
    const response = await api.post('/clients', clientData);
    return response.data;
  },

  updateClient: async (id, clientData) => {
    const response = await api.put(`/clients/${id}`, clientData);
    return response.data;
  },

  deleteClient: async (id) => {
    await api.delete(`/clients/${id}`);
  },
};


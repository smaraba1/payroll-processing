import api from './api';

export const invoiceService = {
  getAllInvoices: async (page = 0, size = 10) => {
    const response = await api.get(`/invoices?page=${page}&size=${size}`);
    return response.data;
  },

  getInvoiceById: async (id) => {
    const response = await api.get(`/invoices/${id}`);
    return response.data;
  },

  getInvoicesByClientId: async (clientId, page = 0, size = 10) => {
    const response = await api.get(`/invoices/client/${clientId}?page=${page}&size=${size}`);
    return response.data;
  },

  searchInvoices: async (filters, page = 0, size = 10) => {
    const params = new URLSearchParams({ page, size, ...filters });
    const response = await api.get(`/invoices/search?${params}`);
    return response.data;
  },

  generateInvoice: async (invoiceData) => {
    const response = await api.post('/invoices/generate', invoiceData);
    return response.data;
  },

  updateInvoiceStatus: async (id, status) => {
    const response = await api.patch(`/invoices/${id}/status`, { status });
    return response.data;
  },

  recordPayment: async (id, paymentData) => {
    const response = await api.post(`/invoices/${id}/payments`, paymentData);
    return response.data;
  },

  deleteInvoice: async (id) => {
    await api.delete(`/invoices/${id}`);
  },
};


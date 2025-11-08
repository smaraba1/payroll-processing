import api from './api';

export const timesheetService = {
  getTimesheetsByUserId: async (userId, page = 0, size = 10) => {
    const response = await api.get(`/timesheets/user/${userId}?page=${page}&size=${size}`);
    return response.data;
  },

  getTimesheetById: async (id) => {
    const response = await api.get(`/timesheets/${id}`);
    return response.data;
  },

  getPendingTimesheetsForManager: async (managerId, page = 0, size = 10) => {
    const response = await api.get(`/timesheets/pending/manager/${managerId}?page=${page}&size=${size}`);
    return response.data;
  },

  createOrUpdateTimesheet: async (userId, timesheetData) => {
    const response = await api.post(`/timesheets/user/${userId}`, timesheetData);
    return response.data;
  },

  submitTimesheet: async (id) => {
    const response = await api.post(`/timesheets/${id}/submit`);
    return response.data;
  },

  approveOrRejectTimesheet: async (id, approved, comments) => {
    const response = await api.post(`/timesheets/${id}/approval`, {
      approved,
      comments,
    });
    return response.data;
  },

  deleteTimesheet: async (id) => {
    await api.delete(`/timesheets/${id}`);
  },
};


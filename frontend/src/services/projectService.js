import api from './api';

export const projectService = {
  getAllProjects: async (page = 0, size = 10) => {
    const response = await api.get(`/projects?page=${page}&size=${size}`);
    return response.data;
  },

  getProjectById: async (id) => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  },

  getProjectsByClientId: async (clientId) => {
    const response = await api.get(`/projects/client/${clientId}`);
    return response.data;
  },

  getActiveProjectsByUserId: async (userId) => {
    const response = await api.get(`/projects/user/${userId}`);
    return response.data;
  },

  createProject: async (projectData) => {
    const response = await api.post('/projects', projectData);
    return response.data;
  },

  updateProject: async (id, projectData) => {
    const response = await api.put(`/projects/${id}`, projectData);
    return response.data;
  },

  deleteProject: async (id) => {
    await api.delete(`/projects/${id}`);
  },

  assignUserToProject: async (userId, projectId) => {
    await api.post('/projects/assignments', { userId, projectId });
  },

  unassignUserFromProject: async (userId, projectId) => {
    await api.delete(`/projects/assignments?userId=${userId}&projectId=${projectId}`);
  },
};


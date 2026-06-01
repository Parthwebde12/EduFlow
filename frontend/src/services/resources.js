import api from './api';

export const resourcesService = {
  getAll: (params) => api.get('/resources', { params }),
  create: (formData) => api.post('/resources', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  toggleLike: (id) => api.post(`/resources/${id}/like`),
  delete: (id) => api.delete(`/resources/${id}`),
};

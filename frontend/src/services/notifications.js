import api from './api';
export const getNotifications = () => {
  return api.get('/notifications');
};
export const markAsRead= (id) => {
  return api.patch(`/notifications/${id}/read`);
};
export const markAllAsRead = () => {
  return api.patch('/notifications/read');
};
export const deleteNotification= (id) => {
  return api.delete(`/notifications/${id}`);
};
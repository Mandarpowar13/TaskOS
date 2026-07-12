import apiClient from './apiClient'
export async function getNotifications() { const { data } = await apiClient.get('/notifications'); return data.data }
export async function markNotificationRead(notificationId) { const { data } = await apiClient.patch(`/notifications/${notificationId}/read`); return data.data }

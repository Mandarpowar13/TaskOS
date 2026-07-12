import apiClient from './apiClient'
export async function getAnalytics() { const { data } = await apiClient.get('/analytics'); return data.data }

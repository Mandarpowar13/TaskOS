import apiClient from './apiClient'
export async function getDashboard() { const { data } = await apiClient.get('/dashboard'); return data.data }

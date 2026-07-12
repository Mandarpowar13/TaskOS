import apiClient from './apiClient'
export async function login(payload) { const { data } = await apiClient.post('/auth/login', payload); return data.data }
export async function register(payload) { const { data } = await apiClient.post('/auth/register', payload); return data.data }
export async function logout() { await apiClient.post('/auth/logout') }

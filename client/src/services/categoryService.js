import apiClient from './apiClient'
export async function getCategories() { const { data } = await apiClient.get('/categories'); return data.data }
export async function createCategory(payload) { const { data } = await apiClient.post('/categories', payload); return data.data }
export async function updateCategory({ categoryId, payload }) { const { data } = await apiClient.patch(`/categories/${categoryId}`, payload); return data.data }
export async function deleteCategory(categoryId) { await apiClient.delete(`/categories/${categoryId}`) }

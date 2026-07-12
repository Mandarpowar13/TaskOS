import apiClient from './apiClient'
export async function getProjects() { const { data } = await apiClient.get('/projects'); return data.data }
export async function createProject(payload) { const { data } = await apiClient.post('/projects', payload); return data.data }
export async function updateProject({ projectId, payload }) { const { data } = await apiClient.patch(`/projects/${projectId}`, payload); return data.data }
export async function archiveProject(projectId) { await apiClient.delete(`/projects/${projectId}`) }

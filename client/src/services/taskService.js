import apiClient from './apiClient'

export async function getTasks(filters = {}) {
  const { data } = await apiClient.get('/tasks', { params: filters })
  return data
}

export async function createTask(payload) {
  const { data } = await apiClient.post('/tasks', payload)
  return data.data
}

export async function updateTask({ taskId, payload }) {
  const { data } = await apiClient.patch(`/tasks/${taskId}`, payload)
  return data.data
}

export async function deleteTask(taskId) {
  await apiClient.delete(`/tasks/${taskId}`)
}

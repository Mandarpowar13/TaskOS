import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('tma-access-token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const refreshToken = localStorage.getItem('tma-refresh-token')

    if (error.response?.status !== 401 || originalRequest?._retry || !refreshToken || originalRequest?.url === '/auth/refresh') {
      return Promise.reject(error)
    }

    originalRequest._retry = true

    try {
      const { data } = await axios.post(`${apiClient.defaults.baseURL}/auth/refresh`, { refreshToken })
      localStorage.setItem('tma-access-token', data.data.accessToken)
      localStorage.setItem('tma-refresh-token', data.data.refreshToken)
      localStorage.setItem('tma-user', JSON.stringify(data.data.user))
      originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`
      return apiClient(originalRequest)
    } catch (refreshError) {
      localStorage.removeItem('tma-access-token')
      localStorage.removeItem('tma-refresh-token')
      localStorage.removeItem('tma-user')
      window.location.assign('/login')
      return Promise.reject(refreshError)
    }
  },
)

export default apiClient

import { create } from 'zustand'

const storedUser = localStorage.getItem('tma-user')
const storedToken = localStorage.getItem('tma-access-token')

export const useAuthStore = create((set) => ({
  user: storedUser ? JSON.parse(storedUser) : null,
  accessToken: storedToken,
  setSession: ({ user, accessToken, refreshToken }) => {
    localStorage.setItem('tma-user', JSON.stringify(user))
    localStorage.setItem('tma-access-token', accessToken)
    localStorage.setItem('tma-refresh-token', refreshToken)
    set({ user, accessToken })
  },
  clearSession: () => {
    localStorage.removeItem('tma-user')
    localStorage.removeItem('tma-access-token')
    localStorage.removeItem('tma-refresh-token')
    set({ user: null, accessToken: null })
  },
}))

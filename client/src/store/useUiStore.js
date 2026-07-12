import { create } from 'zustand'

const getInitialTheme = () => localStorage.getItem('tma-theme') || 'light'

export const useUiStore = create((set) => ({
  sidebarOpen: false,
  theme: getInitialTheme(),
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  toggleTheme: () => set((state) => {
    const theme = state.theme === 'light' ? 'dark' : 'light'
    localStorage.setItem('tma-theme', theme)
    return { theme }
  }),
}))

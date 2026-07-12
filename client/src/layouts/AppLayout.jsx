import { Outlet } from 'react-router-dom'
import Header from '../components/layout/Header'
import Sidebar from '../components/layout/Sidebar'
import { useUiStore } from '../store/useUiStore'

export default function AppLayout() {
  const theme = useUiStore((state) => state.theme)
  return <div className={`app-shell ${theme === 'dark' ? 'dark' : ''}`}><Sidebar /><Header /><main className="main-content"><Outlet /></main></div>
}

import { Bell, LogOut, Menu, Moon, Plus, Search, Sun } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { logout } from '../../services/authService'
import { useAuthStore } from '../../store/useAuthStore'
import { useUiStore } from '../../store/useUiStore'
import IconButton from '../ui/IconButton'

export default function Header() {
  const { theme, toggleTheme, toggleSidebar } = useUiStore()
  const clearSession = useAuthStore((state) => state.clearSession)
  const user = useAuthStore((state) => state.user)
  const navigate = useNavigate()
  const initials = (user?.name || 'TMA').split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()
  async function handleLogout() { try { await logout() } catch { /* Clear local session even if the API is unavailable. */ } finally { clearSession(); navigate('/login') } }
  return <header className="fixed inset-x-0 top-0 z-20 flex h-[68px] items-center justify-between border-b border-slate-200 bg-white/85 px-4 backdrop-blur-lg dark:border-slate-800 dark:bg-slate-900/85 lg:left-[272px] lg:px-8">
    <div className="flex items-center gap-2"><IconButton label="Open navigation" className="lg:hidden" onClick={toggleSidebar}><Menu size={21} /></IconButton><div className="relative hidden sm:block"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={17} /><input aria-label="Search workspace" placeholder="Search tasks, projects, or people..." className="h-10 w-72 rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white" /></div></div>
    <div className="flex items-center gap-1 sm:gap-2"><Link to="/tasks?create=true" className="hidden h-10 items-center gap-2 rounded-xl bg-blue-600 px-3.5 text-sm font-semibold text-white transition hover:bg-blue-700 sm:flex"><Plus size={17} />Add task</Link><IconButton label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'} onClick={toggleTheme}>{theme === 'light' ? <Moon size={19} /> : <Sun size={19} />}</IconButton><IconButton label="Notifications" className="relative" onClick={() => navigate('/notifications')}><Bell size={19} /><span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-blue-600 ring-2 ring-white dark:ring-slate-900" /></IconButton><IconButton label="Sign out" onClick={handleLogout} className="hidden sm:inline-flex"><LogOut size={18} /></IconButton><Link to="/settings" aria-label="Open settings" title={user?.name || 'Account settings'} className="ml-1 grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-xs font-bold text-white transition hover:ring-4 hover:ring-blue-500/20">{initials}</Link></div>
  </header>
}

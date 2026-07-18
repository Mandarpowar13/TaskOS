import { BarChart3, Bell, CalendarDays, Columns3, FolderKanban, LayoutDashboard, ListTodo, Settings, FileText, X } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useUiStore } from '../../store/useUiStore'
import IconButton from '../ui/IconButton'
import { useQuery } from '@tanstack/react-query'
import { getDashboard } from '../../services/dashboardService'

const navigation = [
  { label: 'Dashboard', to: '/', icon: LayoutDashboard }, { label: 'Tasks', to: '/tasks', icon: ListTodo },
  { label: 'Projects', to: '/projects', icon: FolderKanban }, { label: 'Calendar', to: '/calendar', icon: CalendarDays }, { label: 'Kanban', to: '/tasks/board', icon: Columns3 },
  { label: 'Analytics', to: '/analytics', icon: BarChart3 }, { label: 'Reports', to: '/reports', icon: FileText },
]
const secondaryNavigation = [{ label: 'Notifications', to: '/notifications', icon: Bell }, { label: 'Settings', to: '/settings', icon: Settings }]

function NavItems({ items, onNavigate }) {
  return items.map(({ label, to, icon: Icon }) => (
    <NavLink key={to} to={to} onClick={onNavigate} className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${isActive ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/25' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white'}`}>
      <Icon size={19} strokeWidth={1.9} />{label}
    </NavLink>
  ))
}

export default function Sidebar() {
  const { sidebarOpen, setSidebarOpen } = useUiStore()
  const { data: dashboard } = useQuery({ queryKey: ['dashboard'], queryFn: getDashboard })
  const focusScore = dashboard?.metrics?.focusScore ?? 0
  return (
    <>
      {sidebarOpen && <button aria-label="Close navigation" className="fixed inset-0 z-30 bg-slate-950/30 lg:hidden" onClick={() => setSidebarOpen(false)} />}
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-[272px] flex-col border-r border-slate-200 bg-white px-4 py-5 transition-transform duration-200 dark:border-slate-800 dark:bg-slate-900 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="mb-8 flex items-center justify-between px-2">
          <NavLink to="/" className="flex items-center gap-3" onClick={() => setSidebarOpen(false)}>
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-600 text-lg font-bold text-white shadow-lg shadow-blue-600/25">T</span>
            <span><strong className="block text-base tracking-tight text-slate-900 dark:text-white">TMA</strong><small className="block text-[10px] font-semibold uppercase tracking-[.16em] text-slate-400">Work Intelligence</small></span>
          </NavLink>
          <IconButton label="Close navigation" className="lg:hidden" onClick={() => setSidebarOpen(false)}><X size={20} /></IconButton>
        </div>
        <nav className="space-y-1"><p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[.14em] text-slate-400">Workspace</p><NavItems items={navigation} onNavigate={() => setSidebarOpen(false)} /></nav>
        <nav className="mt-8 space-y-1"><p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[.14em] text-slate-400">Manage</p><NavItems items={secondaryNavigation} onNavigate={() => setSidebarOpen(false)} /></nav>
        <div className="mt-auto rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/70">
          <div className="flex items-center justify-between"><div><p className="text-xs font-semibold text-slate-800 dark:text-slate-200">Your focus score</p><p className="mt-1 text-xs text-slate-500">Based on today&apos;s workload</p></div><span className="text-lg font-bold text-blue-600 dark:text-blue-400">{focusScore}</span></div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700"><div className="h-full rounded-full bg-blue-600" style={{ width: `${focusScore}%` }} /></div>
        </div>
      </aside>
    </>
  )
}

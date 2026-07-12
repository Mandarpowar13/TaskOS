import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ProtectedRoute from '../components/common/ProtectedRoute'
import AuthPage from '../features/auth/AuthPage'
import CalendarPage from '../features/calendar/CalendarPage'
import AnalyticsPage from '../features/analytics/AnalyticsPage'
import NotificationsPage from '../features/notifications/NotificationsPage'
import ReportsPage from '../features/reports/ReportsPage'
import KanbanPage from '../features/tasks/KanbanPage'
import PagePlaceholder from '../components/common/PagePlaceholder'
import Dashboard from '../features/dashboard/Dashboard'
import ProjectsPage from '../features/projects/ProjectsPage'
import SettingsPage from '../features/settings/SettingsPage'
import TasksPage from '../features/tasks/TasksPage'
import AppLayout from '../layouts/AppLayout'

const pages = [
]

export default function AppRoutes() {
  return <BrowserRouter><Routes><Route path="/login" element={<AuthPage />} /><Route element={<ProtectedRoute />}><Route element={<AppLayout />}><Route index element={<Dashboard />} /><Route path="tasks" element={<TasksPage />} /><Route path="tasks/board" element={<KanbanPage />} /><Route path="projects" element={<ProjectsPage />} /><Route path="calendar" element={<CalendarPage />} /><Route path="analytics" element={<AnalyticsPage />} /><Route path="reports" element={<ReportsPage />} /><Route path="notifications" element={<NotificationsPage />} /><Route path="settings" element={<SettingsPage />} />{pages.map((page) => <Route key={page.path} path={page.path} element={<PagePlaceholder title={page.title} description={page.description} />} />)}</Route></Route></Routes></BrowserRouter>
}

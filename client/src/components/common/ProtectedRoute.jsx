import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../store/useAuthStore'
export default function ProtectedRoute() { const token = useAuthStore((state) => state.accessToken); const location = useLocation(); return token ? <Outlet /> : <Navigate to="/login" replace state={{ from: location }} /> }

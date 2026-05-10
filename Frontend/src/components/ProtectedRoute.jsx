import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useTravelApp } from '../context/TravelAppContext'

function ProtectedRoute() {
  const { isAuthenticated } = useTravelApp()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}

export default ProtectedRoute

import { Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import { useTravelApp } from './context/TravelAppContext'
import ActivitySearchPage from './pages/ActivitySearch/ActivitySearchPage'
import BudgetPage from './pages/Budget/BudgetPage'
import CitySearchPage from './pages/CitySearch/CitySearchPage'
import DashboardPage from './pages/Dashboard/DashboardPage'
import ItineraryBuilderPage from './pages/ItineraryBuilder/ItineraryBuilderPage'
import ItineraryViewPage from './pages/ItineraryView/ItineraryViewPage'
import LoginPage from './pages/Login/LoginPage'
import MapSearchPage from './pages/MapSearch/MapSearchPage'
import MyTripsPage from './pages/MyTrips/MyTripsPage'
import NotesPage from './pages/Notes/NotesPage'
import PackingPage from './pages/Packing/PackingPage'
import ProfilePage from './pages/Profile/ProfilePage'
import PublicItineraryPage from './pages/PublicItinerary/PublicItineraryPage'
import TripFormPage from './pages/TripForm/TripFormPage'
import './App.css'
import './styles/travelApp.css'

function HomeRedirect() {
  const { isAuthenticated } = useTravelApp()

  return <Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />
}

function App() {
  const { isAuthenticated } = useTravelApp()

  return (
    <div className="app-shell">
      <Routes>
        <Route path="/" element={<HomeRedirect />} />
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />}
        />
        <Route path="/public/:tripId" element={<PublicItineraryPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/trips" element={<MyTripsPage />} />
          <Route path="/trips/new" element={<TripFormPage />} />
          <Route path="/trips/:tripId/edit" element={<TripFormPage />} />
          <Route path="/trips/:tripId/map-search" element={<MapSearchPage />} />
          <Route path="/trips/:tripId/itinerary/builder" element={<ItineraryBuilderPage />} />
          <Route path="/trips/:tripId/itinerary" element={<ItineraryViewPage />} />
          <Route path="/trips/:tripId/cities" element={<CitySearchPage />} />
          <Route path="/trips/:tripId/activities" element={<ActivitySearchPage />} />
          <Route path="/trips/:tripId/budget" element={<BudgetPage />} />
          <Route path="/trips/:tripId/packing" element={<PackingPage />} />
          <Route path="/trips/:tripId/notes" element={<NotesPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default App

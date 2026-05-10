import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SiteLayout from '../../components/SiteLayout'
import { useTravelApp } from '../../context/TravelAppContext'
import {
  formatCurrency,
  formatDateRange,
  getTripTotalBudget,
} from '../../utils/travelFormatters'
import BudgetHighlights from './components/BudgetHighlights'
import QuickActionChips from './components/QuickActionChips'
import RecentTripsPanel from './components/RecentTripsPanel'
import RecommendationCarousel from './components/RecommendationCarousel'
import TopCitiesCarousel from './components/TopCitiesCarousel'

function DashboardPage() {
  const navigate = useNavigate()
  const { trips, user, cityCatalog } = useTravelApp()
  const [activeCityIndex, setActiveCityIndex] = useState(0)

  const topCities = cityCatalog.slice(0, 3).map((city) => ({
    title: city.name,
    location: `${city.country}`,
    subtitle: city.highlight,
    rating: `${(city.popularity / 20).toFixed(1)}`,
    image: city.image,
    mapQuery: city.mapQuery,
  }))

  const activeCity = topCities[activeCityIndex] || topCities[0]

  const budgetHighlights = trips.slice(0, 3).map((trip) => ({
    title: trip.name,
    price: formatCurrency(getTripTotalBudget(trip)),
    duration: `${formatDateRange(trip.startDate, trip.endDate)}`,
    details: trip.description,
    image: trip.coverPhoto || cityCatalog[0].image,
  }))

  const recommendations = cityCatalog.slice(3, 6).map((city) => ({
    title: city.name,
    subtitle: city.highlight,
    image: city.image,
    tags: [city.region, city.costIndex, `${city.popularity}% popularity`],
  }))

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveCityIndex((currentIndex) => (currentIndex + 1) % topCities.length)
    }, 6000)

    return () => window.clearInterval(intervalId)
  }, [topCities.length])

  return (
    <SiteLayout
      mapQuery={activeCity?.mapQuery}
      navVariant="dashboard"
      contentClassName="dashboard-home-content"
      headerActions={
        <>
          <button
            type="button"
            className="site-profile-chip"
            onClick={() => navigate('/profile')}
            aria-label="Open profile"
          >
            {user.name.slice(0, 2).toUpperCase()}
          </button>
        </>
      }
    >
      <div className="dashboard-home-grid">
        <section className="dashboard-budget-slot">
          <BudgetHighlights items={budgetHighlights} />
        </section>

        <section className="dashboard-home-center">
          <div className="dashboard-map-pill">
            Live map synced to {activeCity.title}
          </div>
          <p className="page-eyebrow dashboard-home-eyebrow">Curated luxury journeys, all in one place</p>
          <h1 className="dashboard-home-title">Welcome back, {user.name}</h1>
          <p className="dashboard-home-description">
            Review your upcoming escapes, revisit recent plans, and explore the next
            destination with a dashboard that keeps inspiration, budget, and action in one
            refined flow.
          </p>

          
          <QuickActionChips
            trips={trips}
            onCreateTrip={() => navigate('/trips/new')}
            onOpenProfile={() => navigate('/profile')}
            onOpenBudget={(tripId) => navigate(`/trips/${tripId}/budget`)}
          />

          <RecentTripsPanel
            trips={trips.slice(0, 3)}
            onOpenTrip={(tripId) => navigate(`/trips/${tripId}/itinerary`)}
          />
        </section>

        <section className="dashboard-city-slot">
          <TopCitiesCarousel
            items={topCities}
            activeIndex={activeCityIndex}
            onChange={setActiveCityIndex}
          />
        </section>

        <section className="dashboard-recommendation-slot">
          <RecommendationCarousel items={recommendations} />
        </section>
      </div>
    </SiteLayout>
  )
}

export default DashboardPage

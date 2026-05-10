import { useNavigate } from 'react-router-dom'
import SiteLayout from '../../components/SiteLayout'
import { useTravelApp } from '../../context/TravelAppContext'
import TripCard from './components/TripCard'

function MyTripsPage() {
  const navigate = useNavigate()
  const { trips, deleteTrip, copyTrip } = useTravelApp()

  return (
    <SiteLayout
      mapQuery={trips[0]?.destinationSummary || 'Travel planning map'}
      eyebrow="Trips"
      title="Your trip collection"
      description="Open active plans, review drafts, and manage every itinerary from a single gallery."
      actions={
        <button type="button" className="site-button site-button-primary" onClick={() => navigate('/trips/new')}>
          Create New Trip
        </button>
      }
    >
      <section className="card-grid card-grid-trips">
        {trips.map((trip) => (
          <TripCard
            key={trip.id}
            trip={trip}
            onView={() => navigate(`/trips/${trip.id}/itinerary`)}
            onEdit={() => navigate(`/trips/${trip.id}/edit`)}
            onCopy={() => copyTrip(trip.id)}
            onDelete={() => deleteTrip(trip.id)}
          />
        ))}
      </section>
    </SiteLayout>
  )
}

export default MyTripsPage

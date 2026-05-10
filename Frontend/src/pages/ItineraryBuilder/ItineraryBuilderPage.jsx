import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import SiteLayout from '../../components/SiteLayout'
import TripWorkspaceNav from '../../components/TripWorkspaceNav'
import { useTravelApp } from '../../context/TravelAppContext'
import ManualStopForm from './components/ManualStopForm'
import StopCard from './components/StopCard'

function ItineraryBuilderPage() {
  const navigate = useNavigate()
  const { tripId } = useParams()
  const { trips, addStop, updateStop, moveStop, removeStop, removeActivityFromStop, updateActivityTime } =
    useTravelApp()
  const trip = trips.find((item) => item.id === tripId)
  const [stopForm, setStopForm] = useState({
    city: '',
    country: '',
    region: '',
    startDate: '',
    endDate: '',
  })

  if (!trip) {
    return null
  }

  const handleAddStop = (event) => {
    event.preventDefault()

    addStop(trip.id, {
      cityId: '',
      city: stopForm.city,
      country: stopForm.country,
      region: stopForm.region,
      startDate: stopForm.startDate,
      endDate: stopForm.endDate,
      activities: [],
    })

    setStopForm({
      city: '',
      country: '',
      region: '',
      startDate: '',
      endDate: '',
    })
  }

  return (
    <SiteLayout
      mapQuery={trip.destinationSummary}
      eyebrow="Itinerary builder"
      title={trip.name}
      description="Add stops, define travel dates for each city, assign activities, and reorder the route until the flow feels right."
      actions={
        <>
          <button
            type="button"
            className="site-button site-button-primary"
            onClick={() => navigate(`/trips/${trip.id}/map-search`)}
          >
            Add Stop
          </button>
          <button
            type="button"
            className="site-button site-button-light"
            onClick={() => navigate(`/trips/${trip.id}/itinerary`)}
          >
            View Itinerary
          </button>
        </>
      }
    >
      <TripWorkspaceNav tripId={trip.id} />

      <section className="panel-card panel-grid panel-grid-2">
        <ManualStopForm
          stopForm={stopForm}
          setStopForm={setStopForm}
          onSubmit={handleAddStop}
          tripId={trip.id}
        />

        <div className="stack-list">
          {trip.destinations.map((stop, index) => (
            <StopCard
              key={stop.id}
              stop={stop}
              index={index}
              tripId={trip.id}
              onMoveUp={() => moveStop(trip.id, stop.id, 'up')}
              onMoveDown={() => moveStop(trip.id, stop.id, 'down')}
              onDelete={() => removeStop(trip.id, stop.id)}
              onUpdateStop={updateStop}
              onUpdateActivityTime={updateActivityTime}
              onRemoveActivity={removeActivityFromStop}
              onAssignActivities={() => navigate(`/trips/${trip.id}/activities?stopId=${stop.id}`)}
            />
          ))}
        </div>
      </section>
    </SiteLayout>
  )
}

export default ItineraryBuilderPage

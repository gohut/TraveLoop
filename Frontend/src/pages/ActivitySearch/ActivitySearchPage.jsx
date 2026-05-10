import { useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import SiteLayout from '../../components/SiteLayout'
import TripWorkspaceNav from '../../components/TripWorkspaceNav'
import { useTravelApp } from '../../context/TravelAppContext'
import ActivityFilters from './components/ActivityFilters'
import ActivityResultCard from './components/ActivityResultCard'

function ActivitySearchPage() {
  const location = useLocation()
  const { tripId } = useParams()
  const { trips, activityCatalog, addActivityToStop, removeActivityFromStop } = useTravelApp()
  const trip = trips.find((item) => item.id === tripId)
  const [typeFilter, setTypeFilter] = useState('All')
  const [costFilter, setCostFilter] = useState('All')
  const [durationFilter, setDurationFilter] = useState('All')
  const [selectedStopId, setSelectedStopId] = useState(
    new URLSearchParams(location.search).get('stopId') || trip?.destinations[0]?.id || '',
  )

  if (!trip) {
    return null
  }

  const typeOptions = ['All', ...new Set(activityCatalog.map((activity) => activity.type))]

  const filteredActivities = activityCatalog.filter((activity) => {
    const matchesType = typeFilter === 'All' || activity.type === typeFilter
    const matchesCost =
      costFilter === 'All' ||
      (costFilter === 'Low' && activity.cost <= 2500) ||
      (costFilter === 'Medium' && activity.cost > 2500 && activity.cost <= 6000) ||
      (costFilter === 'High' && activity.cost > 6000)
    const matchesDuration =
      durationFilter === 'All' ||
      (durationFilter === 'Short' && activity.durationHours <= 2) ||
      (durationFilter === 'Medium' && activity.durationHours > 2 && activity.durationHours <= 4) ||
      (durationFilter === 'Long' && activity.durationHours > 4)

    return matchesType && matchesCost && matchesDuration
  })

  const selectedStop = trip.destinations.find((stop) => stop.id === selectedStopId)

  return (
    <SiteLayout
      mapQuery={trip.destinationSummary}
      eyebrow="Activity search"
      title={`Choose activities for ${trip.name}`}
      description="Filter experiences by type, cost, and duration, then attach them to any itinerary stop."
    >
      <TripWorkspaceNav tripId={trip.id} />

      <ActivityFilters
        trip={trip}
        selectedStopId={selectedStopId}
        typeFilter={typeFilter}
        costFilter={costFilter}
        durationFilter={durationFilter}
        typeOptions={typeOptions}
        onStopChange={setSelectedStopId}
        onTypeChange={setTypeFilter}
        onCostChange={setCostFilter}
        onDurationChange={setDurationFilter}
      />

      <section className="card-grid card-grid-2">
        {filteredActivities.map((activity) => {
          const alreadyAdded = selectedStop?.activities.some(
            (item) => item.catalogId === activity.id || item.name === activity.name,
          )

          return (
            <ActivityResultCard
              key={activity.id}
              activity={activity}
              alreadyAdded={alreadyAdded}
              selectedStop={selectedStop}
              selectedStopId={selectedStopId}
              onAdd={() => addActivityToStop(trip.id, selectedStopId, activity.id)}
              onRemove={() => {
                const existingActivity = selectedStop.activities.find(
                  (item) => item.catalogId === activity.id || item.name === activity.name,
                )

                if (existingActivity) {
                  removeActivityFromStop(trip.id, selectedStop.id, existingActivity.id)
                }
              }}
            />
          )
        })}
      </section>
    </SiteLayout>
  )
}

export default ActivitySearchPage

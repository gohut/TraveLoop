import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import SiteLayout from '../../components/SiteLayout'
import TripWorkspaceNav from '../../components/TripWorkspaceNav'
import { useTravelApp } from '../../context/TravelAppContext'
import ItineraryCalendarView from './components/ItineraryCalendarView'
import ItineraryListView from './components/ItineraryListView'

function ItineraryViewPage() {
  const navigate = useNavigate()
  const { tripId } = useParams()
  const { trips } = useTravelApp()
  const trip = trips.find((item) => item.id === tripId)
  const [viewMode, setViewMode] = useState('list')

  if (!trip) {
    return null
  }

  return (
    <SiteLayout
      mapQuery={trip.destinationSummary}
      eyebrow="Itinerary view"
      title={`${trip.name} itinerary`}
      description="Review the full plan in a structured format, either grouped as a flowing list or as a calendar-style schedule."
      actions={
        <>
          <button
            type="button"
            className={`site-button ${viewMode === 'list' ? 'site-button-primary' : 'site-button-light'}`}
            onClick={() => setViewMode('list')}
          >
            List View
          </button>
          <button
            type="button"
            className={`site-button ${viewMode === 'calendar' ? 'site-button-primary' : 'site-button-light'}`}
            onClick={() => setViewMode('calendar')}
          >
            Calendar View
          </button>
          <button
            type="button"
            className="site-button site-button-light"
            onClick={() => navigate(`/public/${trip.id}`)}
          >
            Share
          </button>
        </>
      }
    >
      <TripWorkspaceNav tripId={trip.id} />

      {viewMode === 'list' ? (
        <ItineraryListView destinations={trip.destinations} />
      ) : (
        <ItineraryCalendarView destinations={trip.destinations} />
      )}
    </SiteLayout>
  )
}

export default ItineraryViewPage

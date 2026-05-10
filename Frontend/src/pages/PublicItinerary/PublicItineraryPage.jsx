import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import SiteLayout from '../../components/SiteLayout'
import { useTravelApp } from '../../context/TravelAppContext'
import PublicSharePanel from './components/PublicSharePanel'
import PublicStopTimeline from './components/PublicStopTimeline'

function PublicItineraryPage() {
  const navigate = useNavigate()
  const { tripId } = useParams()
  const { trips, copyTrip } = useTravelApp()
  const trip = trips.find((item) => item.id === tripId)
  const [copied, setCopied] = useState(false)

  if (!trip) {
    return null
  }

  const publicUrl = `${window.location.origin}/public/${trip.id}`

  const handleCopyUrl = async () => {
    await navigator.clipboard.writeText(publicUrl)
    setCopied(true)
  }

  const handleCopyTrip = () => {
    const newTripId = copyTrip(trip.id)

    if (newTripId) {
      navigate(`/trips/${newTripId}/edit`)
    }
  }

  return (
    <SiteLayout
      mapQuery={trip.destinationSummary}
      eyebrow="Shared itinerary"
      title={trip.name}
      description="A read-only public itinerary view for inspiration, review, and quick copying."
      actions={
        <>
          <button type="button" className="site-button site-button-primary" onClick={handleCopyTrip}>
            Copy Trip
          </button>
          <button type="button" className="site-button site-button-light" onClick={handleCopyUrl}>
            {copied ? 'URL Copied' : 'Copy URL'}
          </button>
        </>
      }
    >
      <PublicSharePanel publicUrl={publicUrl} />

      <section className="stack-list">
        <article className="panel-card panel-card-soft">
          <h2>Itinerary summary</h2>
          <p>{trip.description}</p>
          <p>{trip.startDate} to {trip.endDate}</p>
        </article>

        {trip.destinations.map((stop) => (
          <PublicStopTimeline key={stop.id} stop={stop} />
        ))}
      </section>
    </SiteLayout>
  )
}

export default PublicItineraryPage

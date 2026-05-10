import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import SiteLayout from '../../components/SiteLayout'
import TripWorkspaceNav from '../../components/TripWorkspaceNav'
import { useTravelApp } from '../../context/TravelAppContext'
import TripPreviewCard from './components/TripPreviewCard'

function TripFormPage() {
  const navigate = useNavigate()
  const { tripId } = useParams()
  const { trips, createTrip, updateTrip } = useTravelApp()
  const existingTrip = trips.find((trip) => trip.id === tripId)
  const [formState, setFormState] = useState({
    name: '',
    destinationSummary: '',
    startDate: '',
    endDate: '',
    description: '',
    coverPhoto: '',
  })

  useEffect(() => {
    if (existingTrip) {
      setFormState({
        name: existingTrip.name,
        destinationSummary: existingTrip.destinationSummary,
        startDate: existingTrip.startDate,
        endDate: existingTrip.endDate,
        description: existingTrip.description,
        coverPhoto: existingTrip.coverPhoto,
      })
    }
  }, [existingTrip])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormState((currentState) => ({ ...currentState, [name]: value }))
  }

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      setFormState((currentState) => ({
        ...currentState,
        coverPhoto: reader.result,
      }))
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (existingTrip) {
      updateTrip(existingTrip.id, formState)
      navigate(`/trips/${existingTrip.id}/itinerary/builder`)
      return
    }

    const newTripId = createTrip(formState)
    navigate(`/trips/${newTripId}/map-search`)
  }

  return (
    <SiteLayout
      mapQuery={existingTrip?.destinationSummary || 'Luxury travel map'}
      eyebrow="Create trip"
      title={existingTrip ? `Edit ${existingTrip.name}` : 'Build a new trip'}
      description="Set the trip identity first, then continue into stops, activities, budgets, and planning details."
      actions={
        <button type="button" className="site-button site-button-light" onClick={() => navigate('/trips')}>
          Back to My Trips
        </button>
      }
    >
      {existingTrip && <TripWorkspaceNav tripId={existingTrip.id} />}

      <section className="panel-card panel-grid panel-grid-2">
        <form className="stack-form" onSubmit={handleSubmit}>
          <label className="field-group">
            <span>Trip name</span>
            <input
              type="text"
              name="name"
              value={formState.name}
              onChange={handleChange}
              placeholder="Summer Escape"
              required
            />
          </label>

          <label className="field-group">
            <span>Destination summary</span>
            <input
              type="text"
              name="destinationSummary"
              value={formState.destinationSummary}
              onChange={handleChange}
              placeholder="Kyoto, Japan"
            />
          </label>

          <div className="field-row">
            <label className="field-group">
              <span>Start date</span>
              <input
                type="date"
                name="startDate"
                value={formState.startDate}
                onChange={handleChange}
                required
              />
            </label>
            <label className="field-group">
              <span>End date</span>
              <input
                type="date"
                name="endDate"
                value={formState.endDate}
                onChange={handleChange}
                required
              />
            </label>
          </div>

          <label className="field-group">
            <span>Trip description</span>
            <textarea
              name="description"
              value={formState.description}
              onChange={handleChange}
              rows="6"
              placeholder="Describe the tone, purpose, and highlights of the trip."
            />
          </label>

          <label className="field-group">
            <span>Cover photo upload</span>
            <input type="file" accept="image/*" onChange={handleImageUpload} />
          </label>

          <button type="submit" className="site-button site-button-primary">
            Save Trip
          </button>
        </form>

        <TripPreviewCard formState={formState} />
      </section>
    </SiteLayout>
  )
}

export default TripFormPage

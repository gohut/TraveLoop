import { useState, Suspense } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTravelApp } from '../../context/TravelAppContext'
import MapSearchComponent from './components/MapSearchComponent'
import './MapSearchPage.css'

// Fallback component while checking API key
function MapLoadingFallback() {
  return (
    <div className="map-search-page loading-page">
      <div className="loading-content">
        <div className="spinner-small"></div>
        <h2>Loading Map Search...</h2>
      </div>
    </div>
  )
}

function MapSearchPage() {
  const navigate = useNavigate()
  const { tripId } = useParams()
  const { trips, addDynamicStop } = useTravelApp()
  const trip = trips.find((item) => item.id === tripId)

  const [selectedLocation, setSelectedLocation] = useState(null)
  const [isAdding, setIsAdding] = useState(false)
  const [error, setError] = useState(null)

  if (!trip) {
    return (
      <div className="map-search-page error-page">
        <div className="error-content">
          <h2>Trip not found</h2>
          <button onClick={() => navigate('/trips')} className="button-primary">
            Back to Trips
          </button>
        </div>
      </div>
    )
  }

  const handleLocationSelected = (location) => {
    setSelectedLocation(location)
    setError(null)
  }

  const handleAddLocation = async () => {
    if (!selectedLocation) return

    try {
      setIsAdding(true)
      addDynamicStop(tripId, {
        placeId: selectedLocation.placeId,
        name: selectedLocation.name,
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
        address: selectedLocation.address,
        imageUrl: selectedLocation.imageUrl,
        website: selectedLocation.website,
      })

      // Navigate to itinerary builder to set dates
      navigate(`/trips/${tripId}/itinerary/builder`, {
        state: { newLocationAdded: true },
      })
    } catch (err) {
      setError('Failed to add location to trip. Please try again.')
      console.error('Error adding location:', err)
    } finally {
      setIsAdding(false)
    }
  }

  const handleSearchError = (errorMessage) => {
    setError(errorMessage)
  }

  return (
    <div className="map-search-page">
      <MapSearchComponent
        onLocationSelected={handleLocationSelected}
        onError={handleSearchError}
        selectedLocation={selectedLocation}
      />

      {/* Top Action Bar */}
      <div className="map-action-bar">
        <button
          className="map-action-button back-button"
          onClick={() => navigate(`/trips/${tripId}/itinerary/builder`)}
          title="Go back"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* Bottom Action Bar */}
      {selectedLocation && (
        <div className="map-action-bar-bottom">
          <div className="action-bar-content">
            <div className="selected-info">
              <h4>{selectedLocation.name}</h4>
              <p>{selectedLocation.address}</p>
            </div>
            <button
              className="button-primary add-button"
              onClick={handleAddLocation}
              disabled={isAdding || !selectedLocation}
            >
              {isAdding ? 'Adding...' : 'Add to Trip'}
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="error-banner">
          <div className="error-content">
            <span className="error-icon">⚠️</span>
            <span>{error}</span>
            <button
              className="error-close"
              onClick={() => setError(null)}
              aria-label="Close error"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default MapSearchPage

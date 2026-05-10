import { useEffect, useState, useRef, useCallback } from 'react'
import { useGooglePlaces } from '../../../hooks/useGooglePlaces'
import './MapSearch.css'

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

function MapSearchComponent({ onLocationSelected, onError, selectedLocation }) {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const markerRef = useRef(null)
  const searchInputRef = useRef(null)
  const [searchInput, setSearchInput] = useState('')
  const [predictions, setPredictions] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)

  const { isLoaded, error: placesError, searchPlaces, getPlaceDetails } = useGooglePlaces()

  // Show setup message if API key not configured
  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <div className="map-search-container">
        <div className="map-error">
          <div className="error-message">
            <h3>⚙️ Google Maps Setup Required</h3>
            <p>To use Map Search, add your Google Maps API key:</p>
            <ol>
              <li>Create a project at <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer">Google Cloud Console</a></li>
              <li>Enable: Maps JavaScript API, Places API, Geocoding API</li>
              <li>Create an API Key</li>
              <li>Add to your .env file:</li>
              <code>VITE_GOOGLE_MAPS_API_KEY=your_key_here</code>
              <li>Restart your dev server</li>
            </ol>
            <p style={{ marginTop: '20px', color: '#666' }}>For now, you can use the <a href="#" onClick={(e) => { e.preventDefault(); window.location.href = '/trips'; }}>City Search</a> instead.</p>
          </div>
        </div>
      </div>
    )
  }

  // Initialize map
  useEffect(() => {
    if (!isLoaded || !mapRef.current) return

    const map = new window.google.maps.Map(mapRef.current, {
      zoom: 12,
      center: { lat: 20.5937, lng: 78.9629 }, // Default to India center
      mapTypeControl: true,
      fullscreenControl: true,
      streetViewControl: true,
      zoomControl: true,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }],
        },
      ],
    })

    mapInstanceRef.current = map

    // Handle map clicks
    map.addListener('click', () => {
      setShowSuggestions(false)
    })

    return () => {
      mapInstanceRef.current = null
    }
  }, [isLoaded])

  // Handle location selection from predictions
  const handleSelectPrediction = async (prediction) => {
    try {
      setIsSearching(true)
      const details = await getPlaceDetails(prediction.place_id)
      updateMapWithLocation(details)
      onLocationSelected(details)
      setSearchInput(prediction.main_text || prediction.description)
      setPredictions([])
      setShowSuggestions(false)
    } catch (err) {
      console.error('Error fetching place details:', err)
      onError?.(err.message)
    } finally {
      setIsSearching(false)
    }
  }

  // Update map with selected location
  const updateMapWithLocation = (location) => {
    if (!mapInstanceRef.current) return

    const { latitude, longitude, name } = location

    // Center map to location
    mapInstanceRef.current.panTo({ lat: latitude, lng: longitude })
    mapInstanceRef.current.setZoom(15)

    // Remove existing marker
    if (markerRef.current) {
      markerRef.current.setMap(null)
    }

    // Add new marker
    markerRef.current = new window.google.maps.Marker({
      position: { lat: latitude, lng: longitude },
      map: mapInstanceRef.current,
      title: name,
      animation: window.google.maps.Animation.DROP,
    })

    // Add info window
    const infoWindow = new window.google.maps.InfoWindow({
      content: `<div style="font-weight: bold; color: #1a1a1a;">${name}</div>`,
    })

    markerRef.current.addListener('click', () => {
      infoWindow.open(mapInstanceRef.current, markerRef.current)
    })
  }

  // Handle search input
  const handleSearchChange = async (value) => {
    setSearchInput(value)
    setShowSuggestions(true)

    if (value.length < 2) {
      setPredictions([])
      return
    }

    try {
      setIsSearching(true)
      const results = await searchPlaces(value)
      setPredictions(results)
    } catch (err) {
      console.error('Error searching places:', err)
      onError?.(err.message)
      setPredictions([])
    } finally {
      setIsSearching(false)
    }
  }

  // Handle clear button
  const handleClearSearch = () => {
    setSearchInput('')
    setPredictions([])
    setShowSuggestions(false)
  }

  if (placesError) {
    return <div className="map-error">{placesError}</div>
  }

  return (
    <div className="map-search-container">
      <div ref={mapRef} className="map-canvas" />

      <div className="map-search-bar-wrapper">
        <div className="map-search-bar">
          <div className="search-input-group">
            <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              ref={searchInputRef}
              type="text"
              className="search-input"
              placeholder="Search cities, destinations, attractions..."
              value={searchInput}
              onChange={(e) => handleSearchChange(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              disabled={!isLoaded}
            />
            {searchInput && (
              <button
                className="clear-button"
                onClick={handleClearSearch}
                type="button"
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          {showSuggestions && predictions.length > 0 && (
            <div className="suggestions-dropdown">
              {predictions.map((prediction) => (
                <button
                  key={prediction.place_id}
                  className="suggestion-item"
                  onClick={() => handleSelectPrediction(prediction)}
                  type="button"
                >
                  <svg
                    className="location-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <div className="suggestion-content">
                    <div className="suggestion-main">{prediction.main_text}</div>
                    <div className="suggestion-secondary">{prediction.description}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedLocation && (
        <div className="map-info-panel">
          <div className="info-panel-content">
            {selectedLocation.imageUrl && (
              <img src={selectedLocation.imageUrl} alt={selectedLocation.name} className="info-image" />
            )}
            <div className="info-details">
              <h3 className="info-name">{selectedLocation.name}</h3>
              <p className="info-address">{selectedLocation.address}</p>
              <div className="info-coords">
                <span>{selectedLocation.latitude.toFixed(4)}°</span>
                <span>{selectedLocation.longitude.toFixed(4)}°</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {isSearching && (
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      )}
    </div>
  )
}

export default MapSearchComponent

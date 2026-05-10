import { useEffect, useState, useCallback, useRef } from 'react'

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

export function useGooglePlaces() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState(null)
  const placesServiceRef = useRef(null)
  const sessionTokenRef = useRef(null)

  useEffect(() => {
    if (!GOOGLE_MAPS_API_KEY) {
      const errorMsg = 'Google Maps API key not configured. Please add VITE_GOOGLE_MAPS_API_KEY to your .env file'
      console.error('❌ ' + errorMsg)
      console.log('📖 Setup guide: See SETUP_MAP_SEARCH.md in the Frontend folder')
      setError(errorMsg)
      return
    }

    console.log('✅ Google Maps API key found. Loading...')

    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`
    script.async = true
    script.defer = true

    script.onload = () => {
      // Generate a session token for Places API requests
      if (window.google?.maps?.places?.AutocompleteSessionToken) {
        sessionTokenRef.current = new window.google.maps.places.AutocompleteSessionToken()
      }
      console.log('✅ Google Maps API loaded successfully!')
      setIsLoaded(true)
    }

    script.onerror = () => {
      const errorMsg = 'Failed to load Google Maps API. Check your API key and internet connection.'
      console.error('❌ ' + errorMsg)
      setError(errorMsg)
    }

    document.head.appendChild(script)

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script)
      }
    }
  }, [])

  const searchPlaces = useCallback(
    (input) => {
      return new Promise((resolve, reject) => {
        if (!isLoaded || !window.google?.maps?.places?.AutocompleteService) {
          reject(new Error('Google Places API not loaded'))
          return
        }

        const service = new window.google.maps.places.AutocompleteService()
        const request = {
          input: input,
          sessionToken: sessionTokenRef.current,
          componentRestrictions: { country: [] }, // Allow worldwide search
        }

        service.getPlacePredictions(request, (predictions, status) => {
          if (status !== window.google.maps.places.PlacesServiceStatus.OK && status !== 'OK') {
            reject(new Error(`Places API error: ${status}`))
            return
          }

          resolve(predictions || [])
        })
      })
    },
    [isLoaded]
  )

  const getPlaceDetails = useCallback(
    (placeId) => {
      return new Promise((resolve, reject) => {
        if (!isLoaded || !window.google?.maps?.places?.PlacesService) {
          reject(new Error('Google Places API not loaded'))
          return
        }

        const service = new window.google.maps.places.PlacesService(
          document.createElement('div')
        )

        const request = {
          placeId: placeId,
          fields: [
            'name',
            'formatted_address',
            'geometry',
            'place_id',
            'photos',
            'website',
            'opening_hours',
          ],
          sessionToken: sessionTokenRef.current,
        }

        service.getDetails(request, (place, status) => {
          if (status !== window.google.maps.places.PlacesServiceStatus.OK && status !== 'OK') {
            reject(new Error(`Places API error: ${status}`))
            return
          }

          // Generate a new session token for subsequent requests
          if (window.google?.maps?.places?.AutocompleteSessionToken) {
            sessionTokenRef.current = new window.google.maps.places.AutocompleteSessionToken()
          }

          resolve({
            name: place.name,
            address: place.formatted_address,
            latitude: place.geometry.location.lat(),
            longitude: place.geometry.location.lng(),
            placeId: place.place_id,
            imageUrl: place.photos?.[0]?.getUrl({ maxWidth: 400, maxHeight: 400 }) || null,
            website: place.website || null,
            openingHours: place.opening_hours || null,
          })
        })
      })
    },
    [isLoaded]
  )

  return {
    isLoaded,
    error,
    searchPlaces,
    getPlaceDetails,
  }
}

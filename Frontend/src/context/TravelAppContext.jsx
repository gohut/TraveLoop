import { createContext, useContext, useEffect, useState } from 'react'
import { activityCatalog, cityCatalog, seedState } from '../data/travelAppData'

const STORAGE_KEY = 'travelloop-app-state-v2'

const TravelAppContext = createContext(null)

function readInitialState() {
  try {
    const savedState = window.localStorage.getItem(STORAGE_KEY)

    if (savedState) {
      return JSON.parse(savedState)
    }
  } catch (error) {
    console.error('Unable to read Travel Loop state', error)
  }

  return seedState
}

function createId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function updateTripCollection(trips, tripId, updater) {
  return trips.map((trip) => (trip.id === tripId ? updater(trip) : trip))
}

function duplicateTripData(trip) {
  return {
    ...trip,
    id: createId('trip'),
    name: `${trip.name} Copy`,
    notes: trip.notes.map((note) => ({ ...note, id: createId('note') })),
    packing: trip.packing.map((item) => ({ ...item, id: createId('pack') })),
    destinations: trip.destinations.map((stop) => ({
      ...stop,
      id: createId('stop'),
      activities: stop.activities.map((activity) => ({
        ...activity,
        id: createId('trip-activity'),
      })),
    })),
  }
}

function TravelAppProvider({ children }) {
  const [state, setState] = useState(readInitialState)

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const login = ({ email }) => {
    setState((currentState) => ({
      ...currentState,
      isAuthenticated: true,
      user: {
        ...currentState.user,
        email: email || currentState.user.email,
      },
    }))
  }

  const logout = () => {
    setState((currentState) => ({
      ...currentState,
      isAuthenticated: false,
    }))
  }

  const createTrip = (tripInput) => {
    const newTrip = {
      id: createId('trip'),
      name: tripInput.name,
      destinationSummary: tripInput.destinationSummary || 'Destination to be decided',
      description: tripInput.description || '',
      coverPhoto: tripInput.coverPhoto || '',
      startDate: tripInput.startDate,
      endDate: tripInput.endDate,
      destinations: [],
      budget: {
        transport: Number(tripInput.transport || 0),
        stay: Number(tripInput.stay || 0),
        activities: Number(tripInput.activities || 0),
        meals: Number(tripInput.meals || 0),
        dailyLimit: Number(tripInput.dailyLimit || 12000),
      },
      packing: [],
      notes: [],
    }

    setState((currentState) => ({
      ...currentState,
      trips: [newTrip, ...currentState.trips],
    }))

    return newTrip.id
  }

  const updateTrip = (tripId, tripInput) => {
    setState((currentState) => ({
      ...currentState,
      trips: updateTripCollection(currentState.trips, tripId, (trip) => ({
        ...trip,
        ...tripInput,
        budget: tripInput.budget ? { ...trip.budget, ...tripInput.budget } : trip.budget,
      })),
    }))
  }

  const deleteTrip = (tripId) => {
    setState((currentState) => ({
      ...currentState,
      trips: currentState.trips.filter((trip) => trip.id !== tripId),
    }))
  }

  const copyTrip = (tripId) => {
    const trip = state.trips.find((item) => item.id === tripId)

    if (!trip) {
      return null
    }

    const copiedTrip = duplicateTripData(trip)

    setState((currentState) => ({
      ...currentState,
      trips: [copiedTrip, ...currentState.trips],
    }))

    return copiedTrip.id
  }

  const addStop = (tripId, stopInput) => {
    const city = cityCatalog.find((item) => item.id === stopInput.cityId)
    const nextStop = {
      id: createId('stop'),
      cityId: stopInput.cityId,
      city: stopInput.city || city?.name || '',
      country: stopInput.country || city?.country || '',
      region: stopInput.region || city?.region || '',
      startDate: stopInput.startDate,
      endDate: stopInput.endDate,
      activities: stopInput.activities || [],
    }

    setState((currentState) => ({
      ...currentState,
      trips: updateTripCollection(currentState.trips, tripId, (trip) => ({
        ...trip,
        destinationSummary: nextStop.city
          ? `${nextStop.city}, ${nextStop.country}`
          : trip.destinationSummary,
        destinations: [...trip.destinations, nextStop],
      })),
    }))
  }

  const updateStop = (tripId, stopId, stopInput) => {
    setState((currentState) => ({
      ...currentState,
      trips: updateTripCollection(currentState.trips, tripId, (trip) => ({
        ...trip,
        destinations: trip.destinations.map((stop) =>
          stop.id === stopId ? { ...stop, ...stopInput } : stop,
        ),
      })),
    }))
  }

  const removeStop = (tripId, stopId) => {
    setState((currentState) => ({
      ...currentState,
      trips: updateTripCollection(currentState.trips, tripId, (trip) => ({
        ...trip,
        destinations: trip.destinations.filter((stop) => stop.id !== stopId),
      })),
    }))
  }

  const moveStop = (tripId, stopId, direction) => {
    setState((currentState) => ({
      ...currentState,
      trips: updateTripCollection(currentState.trips, tripId, (trip) => {
        const currentIndex = trip.destinations.findIndex((stop) => stop.id === stopId)

        if (currentIndex === -1) {
          return trip
        }

        const nextIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1

        if (nextIndex < 0 || nextIndex >= trip.destinations.length) {
          return trip
        }

        const nextDestinations = [...trip.destinations]
        const [movedStop] = nextDestinations.splice(currentIndex, 1)
        nextDestinations.splice(nextIndex, 0, movedStop)

        return {
          ...trip,
          destinations: nextDestinations,
        }
      }),
    }))
  }

  const addCityToTrip = (tripId, cityId) => {
    const city = cityCatalog.find((item) => item.id === cityId)

    if (!city) {
      return
    }

    addStop(tripId, {
      cityId: city.id,
      city: city.name,
      country: city.country,
      region: city.region,
      startDate: '',
      endDate: '',
      activities: [],
    })
  }

  const addActivityToStop = (tripId, stopId, activityId) => {
    const activity = activityCatalog.find((item) => item.id === activityId)

    if (!activity) {
      return
    }

    setState((currentState) => ({
      ...currentState,
      trips: updateTripCollection(currentState.trips, tripId, (trip) => ({
        ...trip,
        destinations: trip.destinations.map((stop) => {
          if (stop.id !== stopId) {
            return stop
          }

          const alreadyAdded = stop.activities.some(
            (item) => item.catalogId === activity.id || item.name === activity.name,
          )

          if (alreadyAdded) {
            return stop
          }

          return {
            ...stop,
            activities: [
              ...stop.activities,
              {
                id: createId('trip-activity'),
                catalogId: activity.id,
                name: activity.name,
                type: activity.type,
                duration: activity.duration,
                cost: activity.cost,
                image: activity.image,
                description: activity.description,
                time: '10:00',
              },
            ],
          }
        }),
      })),
    }))
  }

  const removeActivityFromStop = (tripId, stopId, activityId) => {
    setState((currentState) => ({
      ...currentState,
      trips: updateTripCollection(currentState.trips, tripId, (trip) => ({
        ...trip,
        destinations: trip.destinations.map((stop) =>
          stop.id === stopId
            ? {
                ...stop,
                activities: stop.activities.filter((activity) => activity.id !== activityId),
              }
            : stop,
        ),
      })),
    }))
  }

  const updateActivityTime = (tripId, stopId, activityId, time) => {
    setState((currentState) => ({
      ...currentState,
      trips: updateTripCollection(currentState.trips, tripId, (trip) => ({
        ...trip,
        destinations: trip.destinations.map((stop) =>
          stop.id === stopId
            ? {
                ...stop,
                activities: stop.activities.map((activity) =>
                  activity.id === activityId ? { ...activity, time } : activity,
                ),
              }
            : stop,
        ),
      })),
    }))
  }

  const addChecklistItem = (tripId, itemInput) => {
    setState((currentState) => ({
      ...currentState,
      trips: updateTripCollection(currentState.trips, tripId, (trip) => ({
        ...trip,
        packing: [
          ...trip.packing,
          {
            id: createId('pack'),
            label: itemInput.label,
            category: itemInput.category,
            packed: false,
          },
        ],
      })),
    }))
  }

  const toggleChecklistItem = (tripId, itemId) => {
    setState((currentState) => ({
      ...currentState,
      trips: updateTripCollection(currentState.trips, tripId, (trip) => ({
        ...trip,
        packing: trip.packing.map((item) =>
          item.id === itemId ? { ...item, packed: !item.packed } : item,
        ),
      })),
    }))
  }

  const removeChecklistItem = (tripId, itemId) => {
    setState((currentState) => ({
      ...currentState,
      trips: updateTripCollection(currentState.trips, tripId, (trip) => ({
        ...trip,
        packing: trip.packing.filter((item) => item.id !== itemId),
      })),
    }))
  }

  const resetChecklist = (tripId) => {
    setState((currentState) => ({
      ...currentState,
      trips: updateTripCollection(currentState.trips, tripId, (trip) => ({
        ...trip,
        packing: trip.packing.map((item) => ({ ...item, packed: false })),
      })),
    }))
  }

  const addNote = (tripId, noteInput) => {
    setState((currentState) => ({
      ...currentState,
      trips: updateTripCollection(currentState.trips, tripId, (trip) => ({
        ...trip,
        notes: [
          {
            id: createId('note'),
            title: noteInput.title,
            content: noteInput.content,
            stopId: noteInput.stopId || '',
            createdAt: new Date().toISOString(),
          },
          ...trip.notes,
        ],
      })),
    }))
  }

  const updateNote = (tripId, noteId, noteInput) => {
    setState((currentState) => ({
      ...currentState,
      trips: updateTripCollection(currentState.trips, tripId, (trip) => ({
        ...trip,
        notes: trip.notes.map((note) =>
          note.id === noteId ? { ...note, ...noteInput } : note,
        ),
      })),
    }))
  }

  const deleteNote = (tripId, noteId) => {
    setState((currentState) => ({
      ...currentState,
      trips: updateTripCollection(currentState.trips, tripId, (trip) => ({
        ...trip,
        notes: trip.notes.filter((note) => note.id !== noteId),
      })),
    }))
  }

  const updateBudget = (tripId, budgetInput) => {
    setState((currentState) => ({
      ...currentState,
      trips: updateTripCollection(currentState.trips, tripId, (trip) => ({
        ...trip,
        budget: {
          ...trip.budget,
          ...budgetInput,
        },
      })),
    }))
  }

  const updateProfile = (profileInput) => {
    setState((currentState) => ({
      ...currentState,
      user: {
        ...currentState.user,
        ...profileInput,
      },
    }))
  }

  const deleteAccount = () => {
    setState({
      ...seedState,
      isAuthenticated: false,
    })
  }

  const toggleSavedDestination = (destinationName) => {
    setState((currentState) => {
      const exists = currentState.savedDestinations.includes(destinationName)

      return {
        ...currentState,
        savedDestinations: exists
          ? currentState.savedDestinations.filter((item) => item !== destinationName)
          : [...currentState.savedDestinations, destinationName],
      }
    })
  }

  const addDynamicStop = (tripId, stopInput) => {
    const nextStop = {
      id: createId('stop'),
      placeId: stopInput.placeId || '',
      city: stopInput.name || '',
      country: '', // Will be extracted from address if needed
      region: '',
      latitude: stopInput.latitude || 0,
      longitude: stopInput.longitude || 0,
      address: stopInput.address || '',
      imageUrl: stopInput.imageUrl || '',
      website: stopInput.website || '',
      startDate: '',
      endDate: '',
      activities: [],
    }

    setState((currentState) => ({
      ...currentState,
      trips: updateTripCollection(currentState.trips, tripId, (trip) => ({
        ...trip,
        destinationSummary: nextStop.city || trip.destinationSummary,
        destinations: [...trip.destinations, nextStop],
      })),
    }))
  }

  const value = {
    ...state,
    cityCatalog,
    activityCatalog,
    login,
    logout,
    createTrip,
    updateTrip,
    deleteTrip,
    copyTrip,
    addStop,
    updateStop,
    removeStop,
    moveStop,
    addCityToTrip,
    addDynamicStop,
    addActivityToStop,
    removeActivityFromStop,
    updateActivityTime,
    addChecklistItem,
    toggleChecklistItem,
    removeChecklistItem,
    resetChecklist,
    addNote,
    updateNote,
    deleteNote,
    updateBudget,
    updateProfile,
    deleteAccount,
    toggleSavedDestination,
  }

  return <TravelAppContext.Provider value={value}>{children}</TravelAppContext.Provider>
}

function useTravelApp() {
  const context = useContext(TravelAppContext)

  if (!context) {
    throw new Error('useTravelApp must be used within TravelAppProvider')
  }

  return context
}

export { TravelAppProvider, useTravelApp }

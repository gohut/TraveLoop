import { useState } from 'react'
import { useParams } from 'react-router-dom'
import SiteLayout from '../../components/SiteLayout'
import TripWorkspaceNav from '../../components/TripWorkspaceNav'
import { useTravelApp } from '../../context/TravelAppContext'
import CityResultCard from './components/CityResultCard'
import CitySearchFilters from './components/CitySearchFilters'

function CitySearchPage() {
  const { tripId } = useParams()
  const { trips, cityCatalog, addCityToTrip, toggleSavedDestination, savedDestinations } =
    useTravelApp()
  const trip = trips.find((item) => item.id === tripId)
  const [searchText, setSearchText] = useState('')
  const [regionFilter, setRegionFilter] = useState('All')
  const [countryFilter, setCountryFilter] = useState('All')

  if (!trip) {
    return null
  }

  const countryOptions = ['All', ...new Set(cityCatalog.map((city) => city.country))]
  const regionOptions = ['All', ...new Set(cityCatalog.map((city) => city.region))]

  const filteredCities = cityCatalog.filter((city) => {
    const matchesText =
      city.name.toLowerCase().includes(searchText.toLowerCase()) ||
      city.country.toLowerCase().includes(searchText.toLowerCase())
    const matchesRegion = regionFilter === 'All' || city.region === regionFilter
    const matchesCountry = countryFilter === 'All' || city.country === countryFilter

    return matchesText && matchesRegion && matchesCountry
  })

  return (
    <SiteLayout
      mapQuery={trip.destinationSummary}
      eyebrow="City search"
      title={`Find cities for ${trip.name}`}
      description="Search by destination, filter by country or region, and add relevant cities straight into the itinerary."
    >
      <TripWorkspaceNav tripId={trip.id} />

      <CitySearchFilters
        searchText={searchText}
        regionFilter={regionFilter}
        countryFilter={countryFilter}
        regionOptions={regionOptions}
        countryOptions={countryOptions}
        onSearchChange={setSearchText}
        onRegionChange={setRegionFilter}
        onCountryChange={setCountryFilter}
      />

      <section className="card-grid card-grid-3">
        {filteredCities.map((city) => (
          <CityResultCard
            key={city.id}
            city={city}
            isSaved={savedDestinations.includes(city.name)}
            onAdd={() => addCityToTrip(trip.id, city.id)}
            onToggleSave={() => toggleSavedDestination(city.name)}
          />
        ))}
      </section>
    </SiteLayout>
  )
}

export default CitySearchPage

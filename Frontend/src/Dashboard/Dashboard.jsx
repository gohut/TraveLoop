import { useEffect, useState } from 'react'
import logo from '../assets/logo.png'
import BudgetHighlights from './components/BudgetHighlights'
import ChatBotWidget from './components/ChatBotWidget'
import RecommendationCarousel from './components/RecommendationCarousel'
import TopCitiesCarousel from './components/TopCitiesCarousel'
import './Dashboard.css'

const budgetHighlights = [
  {
    title: 'Manali Retreat',
    price: 'Rs. 20,000',
    duration: '3 nights luxury stay',
    details: 'Boutique suite, breakfast, airport pickup, and mountain dining.',
    image:
      'https://images.unsplash.com/photo-1518002054494-3a6f94352e9d?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Santorini Escape',
    price: 'Rs. 54,500',
    duration: '4 nights with caldera view',
    details: 'Infinity pool stay, sunset cruise, and private transfers included.',
    image:
      'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Kyoto Calm',
    price: 'Rs. 41,000',
    duration: '5 nights heritage circuit',
    details: 'Ryokan stay, tea ceremony, rail pass, and curated food trail.',
    image:
      'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=900&q=80',
  },
]

const recommendations = [
  {
    title: 'Lake Stadal',
    subtitle: 'Clean alpine air, mirrored waters, and zero-crowd sunrise trails.',
    image:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
    tags: ['Nature reset', 'Low spend', 'Photography'],
  },
  {
    title: 'Cappadocia',
    subtitle: 'Balloon-filled dawn skies and cave suites designed for slow travel.',
    image:
      'https://images.unsplash.com/photo-1643055539164-0f7b9152b53d?auto=format&fit=crop&w=1200&q=80',
    tags: ['Romantic', 'Luxury stay', 'Bucket list'],
  },
  {
    title: 'Hallstatt',
    subtitle: 'Storybook lakeside lanes paired with scenic train journeys and calm evenings.',
    image:
      'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=1200&q=80',
    tags: ['Scenic rail', 'Weekend break', 'Culture'],
  },
]

const topCities = [
  {
    title: 'London Bridge',
    location: 'London, United Kingdom',
    subtitle: 'An iconic riverside district with skyline views, walkable history, and lively evenings.',
    rating: '4.8',
    image:
      'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=900&q=80',
    mapQuery: 'Tower Bridge London',
  },
  {
    title: 'Marina Bay',
    location: 'Singapore',
    subtitle: 'A polished city playground of waterfront promenades, design hotels, and dining.',
    rating: '4.9',
    image:
      'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=900&q=80',
    mapQuery: 'Marina Bay Singapore',
  },
  {
    title: 'Burj Khalifa',
    location: 'Dubai, United Arab Emirates',
    subtitle: 'Sky-high city glamour, premium shopping, and desert luxury in one itinerary.',
    rating: '4.7',
    image:
      'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=900&q=80',
    mapQuery: 'Burj Khalifa Dubai',
  },
]

const recentTrips = [
  {
    title: 'Udaipur Palace Weekend',
    meta: '12 Jun - 15 Jun',
    status: 'Upcoming',
  },
  {
    title: 'Coorg Wellness Retreat',
    meta: '24 Jul - 28 Jul',
    status: 'Drafted',
  },
  {
    title: 'Istanbul Culture Trail',
    meta: 'Saved inspiration',
    status: 'Wishlist',
  },
]

const quickActions = ['Plan New Trip', 'Review Wishlist', 'Budget Snapshot']

function Dashboard() {
  const [activeCityIndex, setActiveCityIndex] = useState(0)
  const activeCity = topCities[activeCityIndex]

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveCityIndex((currentIndex) => (currentIndex + 1) % topCities.length)
    }, 6500)

    return () => window.clearInterval(intervalId)
  }, [])

  const mapSource = `https://www.google.com/maps?q=${encodeURIComponent(activeCity.mapQuery)}&z=14&output=embed`

  return (
    <div className="dashboard-page">
      <div className="dashboard-map-layer" aria-hidden="true">
        <iframe
          key={activeCity.mapQuery}
          className="dashboard-map-frame"
          src={mapSource}
          title={`${activeCity.title} map`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      <div className="dashboard-veil" />
      <div className="dashboard-glow dashboard-glow-left" />
      <div className="dashboard-glow dashboard-glow-right" />

      <header className="dashboard-nav">
        <div className="dashboard-brand">
          <img className="dashboard-logo" src={logo} alt="Travel Loop" />
        </div>

        <div className="dashboard-nav-actions">
          <button type="button" className="dashboard-nav-button">
            My Trips
          </button>
          <button
            type="button"
            className="dashboard-profile-button"
            aria-label="Open profile"
          >
            <span>TL</span>
          </button>
        </div>
      </header>

      <main className="dashboard-grid">
        <section className="dashboard-budget-slot">
          <BudgetHighlights items={budgetHighlights} />
        </section>

        <section className="dashboard-hero-panel">
          <div className="dashboard-map-pill">
            Live map synced to {activeCity.title}
          </div>
          <p className="dashboard-eyebrow">Curated luxury journeys, all in one place</p>
          <h1 className="dashboard-title">Welcome back, Mr. Traveller</h1>
          <p className="dashboard-description">
            Review your upcoming escapes, revisit recent plans, and explore the next
            destination with a dashboard that keeps inspiration, budget, and action in one
            refined flow.
          </p>

          <div className="dashboard-cta-row">
            <button type="button" className="dashboard-primary-button">
              Plan New Trip
            </button>
            <button type="button" className="dashboard-secondary-button">
              My Trips
            </button>
          </div>

          <div className="dashboard-quick-actions">
            {quickActions.map((action) => (
              <button key={action} type="button" className="dashboard-chip">
                {action}
              </button>
            ))}
          </div>

          <div className="dashboard-trips-panel">
            <div className="dashboard-section-heading">
              <span>Recent trips</span>
              <span className="dashboard-section-subtle">Your planning momentum</span>
            </div>
            <div className="dashboard-trip-list">
              {recentTrips.map((trip) => (
                <article key={trip.title} className="dashboard-trip-card">
                  <span className="dashboard-trip-status">{trip.status}</span>
                  <h2>{trip.title}</h2>
                  <p>{trip.meta}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="dashboard-city-slot">
          <TopCitiesCarousel
            items={topCities}
            activeIndex={activeCityIndex}
            onChange={setActiveCityIndex}
          />
        </section>

        <section className="dashboard-recommendation-slot">
          <RecommendationCarousel items={recommendations} />
        </section>
      </main>

      <ChatBotWidget highlightedCity={activeCity} />
    </div>
  )
}

export default Dashboard

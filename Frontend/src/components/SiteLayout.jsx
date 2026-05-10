import { NavLink, useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'
import { useTravelApp } from '../context/TravelAppContext'
import ChatAssistant from './ChatAssistant'

const primaryLinks = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/trips', label: 'My Trips' },
  { to: '/trips/new', label: 'Create Trip' },
  { to: '/profile', label: 'Profile' },
]

function SiteLayout({
  children,
  mapQuery = 'Luxury travel destinations world map',
  eyebrow,
  title,
  description,
  actions,
  hideNavLinks = false,
  headerActions,
  navVariant = 'default',
  contentClassName = '',
}) {
  const navigate = useNavigate()
  const { user, logout } = useTravelApp()
  const mapSource = `https://maps.google.com/maps?width=100%25&height=100%25&hl=en&q=${encodeURIComponent(mapQuery)}&t=&z=12&ie=UTF8&iwloc=B&output=embed`

  return (
    <div className={`site-page site-page-${navVariant}`}>
      <div className="site-map-layer" aria-hidden="true">
        <iframe
          className="site-map-frame"
          src={mapSource}
          title="Travel Loop map background"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
      <div className="site-veil" />
      <div className="site-glow site-glow-left" />
      <div className="site-glow site-glow-right" />

      <header className={`site-nav site-nav-${navVariant}`}>
        <button
          type="button"
          className={`site-brand site-brand-${navVariant}`}
          onClick={() => navigate('/dashboard')}
        >
          <img className="site-logo" src={logo} alt="Travel Loop" />
        </button>

        {!hideNavLinks && (
          <nav className="site-nav-links">
            {primaryLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `site-nav-link ${isActive ? 'is-active' : ''}`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        )}

        <div className="site-nav-actions">
          {headerActions || (
            <>
              <button type="button" className="site-button site-button-light" onClick={logout}>
                Logout
              </button>
              <button
                type="button"
                className="site-profile-chip"
                onClick={() => navigate('/profile')}
                aria-label="Open profile"
              >
                {user.name.slice(0, 2).toUpperCase()}
              </button>
            </>
          )}
        </div>
      </header>

      <main className={`site-content ${contentClassName}`.trim()}>
        {(eyebrow || title || description || actions) && (
          <section className="page-hero">
            <div className="page-hero-copy">
              {eyebrow && <p className="page-eyebrow">{eyebrow}</p>}
              {title && <h1 className="page-title">{title}</h1>}
              {description && <p className="page-description">{description}</p>}
            </div>
            {actions && <div className="page-hero-actions">{actions}</div>}
          </section>
        )}

        {children}
      </main>

      <ChatAssistant />
    </div>
  )
}

export default SiteLayout

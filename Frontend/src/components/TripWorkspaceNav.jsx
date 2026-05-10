import { NavLink } from 'react-router-dom'

const tripLinks = [
  { suffix: '/edit', label: 'Trip Details' },
  { suffix: '/itinerary/builder', label: 'Builder' },
  { suffix: '/itinerary', label: 'View' },
  { suffix: '/cities', label: 'Cities' },
  { suffix: '/activities', label: 'Activities' },
  { suffix: '/budget', label: 'Budget' },
  { suffix: '/packing', label: 'Packing' },
  { suffix: '/notes', label: 'Notes' },
]

function TripWorkspaceNav({ tripId }) {
  return (
    <div className="subnav-strip">
      {tripLinks.map((link) => (
        <NavLink
          key={link.suffix}
          to={`/trips/${tripId}${link.suffix}`}
          className={({ isActive }) => `subnav-chip ${isActive ? 'is-active' : ''}`}
        >
          {link.label}
        </NavLink>
      ))}
    </div>
  )
}

export default TripWorkspaceNav

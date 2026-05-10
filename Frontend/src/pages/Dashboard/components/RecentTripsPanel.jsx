import { formatDateRange } from '../../../utils/travelFormatters'

function RecentTripsPanel({ trips, onOpenTrip }) {
  return (
    <div className="dashboard-trips-panel dashboard-home-trips">
      <div className="dashboard-section-heading">
        <span>Recent trips</span>
        <span className="dashboard-section-subtle">Your planning momentum</span>
      </div>
      <div className="dashboard-trip-list">
        {trips.map((trip) => (
          <article
            key={trip.id}
            className="dashboard-trip-card dashboard-trip-card-action"
            onClick={() => onOpenTrip(trip.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                onOpenTrip(trip.id)
              }
            }}
          >
            <span className="dashboard-trip-status">
              {trip.destinations.length ? 'Upcoming' : 'Drafted'}
            </span>
            <h2>{trip.name}</h2>
            <p>{formatDateRange(trip.startDate, trip.endDate)}</p>
          </article>
        ))}
      </div>
    </div>
  )
}

export default RecentTripsPanel

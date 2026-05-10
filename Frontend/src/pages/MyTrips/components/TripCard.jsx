import { formatDateRange, getDestinationCount } from '../../../utils/travelFormatters'

function TripCard({ trip, onView, onEdit, onCopy, onDelete }) {
  return (
    <article className="panel-card trip-card">
      <div className="trip-card-cover">
        <img src={trip.coverPhoto} alt={trip.name} />
      </div>
      <div className="trip-card-body">
        <div className="trip-card-topline">
          <span className="status-badge">{trip.destinations.length ? 'Planned' : 'Draft'}</span>
          <span>{getDestinationCount(trip)} destinations</span>
        </div>
        <h2>{trip.name}</h2>
        <p>{trip.destinationSummary}</p>
        <p>{formatDateRange(trip.startDate, trip.endDate)}</p>

        <div className="inline-actions">
          <button type="button" className="site-button site-button-primary" onClick={onView}>
            View
          </button>
          <button type="button" className="site-button site-button-light" onClick={onEdit}>
            Edit
          </button>
          <button type="button" className="site-button site-button-light" onClick={onCopy}>
            Copy
          </button>
          <button type="button" className="site-button site-button-danger" onClick={onDelete}>
            Delete
          </button>
        </div>
      </div>
    </article>
  )
}

export default TripCard

import { formatDateRange } from '../../../utils/travelFormatters'

function PublicStopTimeline({ stop }) {
  return (
    <article className="panel-card panel-card-soft">
      <h2>{stop.city}</h2>
      <p>{formatDateRange(stop.startDate, stop.endDate)}</p>
      <div className="timeline-list">
        {stop.activities.map((activity) => (
          <div key={activity.id} className="timeline-item">
            <div className="timeline-time">{activity.time || '10:00'}</div>
            <div className="timeline-body">
              <h3>{activity.name}</h3>
              <p>{activity.description}</p>
            </div>
          </div>
        ))}
      </div>
    </article>
  )
}

export default PublicStopTimeline

import { formatCurrency, formatDateRange } from '../../../utils/travelFormatters'

function ItineraryListView({ destinations }) {
  return (
    <section className="stack-list">
      {destinations.map((stop, index) => (
        <article key={stop.id} className="panel-card panel-card-soft">
          <div className="section-row">
            <div>
              <p className="page-eyebrow">Day block {index + 1}</p>
              <h2>{stop.city}</h2>
            </div>
            <span className="status-badge">{formatDateRange(stop.startDate, stop.endDate)}</span>
          </div>

          <div className="timeline-list">
            {stop.activities.map((activity) => (
              <div key={activity.id} className="timeline-item">
                <div className="timeline-time">{activity.time || '10:00'}</div>
                <div className="timeline-body">
                  <h3>{activity.name}</h3>
                  <p>{activity.description}</p>
                  <span>
                    {activity.duration} | {formatCurrency(activity.cost)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </article>
      ))}
    </section>
  )
}

export default ItineraryListView

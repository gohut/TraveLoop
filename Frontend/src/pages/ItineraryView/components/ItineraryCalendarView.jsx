import { formatDate } from '../../../utils/travelFormatters'

function ItineraryCalendarView({ destinations }) {
  return (
    <section className="card-grid card-grid-3">
      {destinations.map((stop) => (
        <article key={stop.id} className="panel-card panel-card-soft calendar-card">
          <h2>{stop.city}</h2>
          <p>{formatDate(stop.startDate)}</p>
          {stop.activities.map((activity) => (
            <div key={activity.id} className="calendar-entry">
              <strong>{activity.time || '10:00'}</strong>
              <span>{activity.name}</span>
            </div>
          ))}
        </article>
      ))}
    </section>
  )
}

export default ItineraryCalendarView

import { formatDateRange } from '../../../utils/travelFormatters'

function StopCard({
  stop,
  index,
  tripId,
  onMoveUp,
  onMoveDown,
  onDelete,
  onUpdateStop,
  onUpdateActivityTime,
  onRemoveActivity,
  onAssignActivities,
}) {
  return (
    <article className="panel-card panel-card-soft stop-card">
      <div className="stop-card-topline">
        <div>
          <p className="page-eyebrow">Stop {index + 1}</p>
          <h2>{stop.city}</h2>
          <p>{stop.country || 'Country TBD'}</p>
        </div>
        <div className="inline-actions">
          <button type="button" className="mini-button" onClick={onMoveUp}>
            Up
          </button>
          <button type="button" className="mini-button" onClick={onMoveDown}>
            Down
          </button>
          <button type="button" className="mini-button danger" onClick={onDelete}>
            Delete
          </button>
        </div>
      </div>

      <div className="field-row">
        <label className="field-group">
          <span>Start</span>
          <input
            type="date"
            value={stop.startDate}
            onChange={(event) => onUpdateStop(tripId, stop.id, { startDate: event.target.value })}
          />
        </label>
        <label className="field-group">
          <span>End</span>
          <input
            type="date"
            value={stop.endDate}
            onChange={(event) => onUpdateStop(tripId, stop.id, { endDate: event.target.value })}
          />
        </label>
      </div>

      <p>{formatDateRange(stop.startDate, stop.endDate)}</p>

      <div className="activity-stack">
        {stop.activities.map((activity) => (
          <div key={activity.id} className="activity-line">
            <div>
              <strong>{activity.name}</strong>
              <p>{activity.type}</p>
            </div>
            <div className="activity-line-actions">
              <input
                type="time"
                value={activity.time || '10:00'}
                onChange={(event) =>
                  onUpdateActivityTime(tripId, stop.id, activity.id, event.target.value)
                }
              />
              <button
                type="button"
                className="mini-button danger"
                onClick={() => onRemoveActivity(tripId, stop.id, activity.id)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <button type="button" className="site-button site-button-light" onClick={onAssignActivities}>
        Assign activities
      </button>
    </article>
  )
}

export default StopCard

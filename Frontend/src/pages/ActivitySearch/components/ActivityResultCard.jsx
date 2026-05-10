import { formatCurrency } from '../../../utils/travelFormatters'

function ActivityResultCard({
  activity,
  alreadyAdded,
  selectedStop,
  selectedStopId,
  onAdd,
  onRemove,
}) {
  return (
    <article className="panel-card activity-card">
      <img src={activity.image} alt={activity.name} className="activity-card-image" />
      <div className="activity-card-body">
        <div className="section-row">
          <h2>{activity.name}</h2>
          <span className="status-badge">{activity.type}</span>
        </div>
        <p>{activity.description}</p>
        <p>
          {activity.duration} | {formatCurrency(activity.cost)}
        </p>
        <div className="inline-actions">
          <button
            type="button"
            className="site-button site-button-primary"
            onClick={onAdd}
            disabled={!selectedStopId || alreadyAdded}
          >
            {alreadyAdded ? 'Added' : 'Add'}
          </button>
          {selectedStop && alreadyAdded && (
            <button type="button" className="site-button site-button-light" onClick={onRemove}>
              Remove
            </button>
          )}
        </div>
      </div>
    </article>
  )
}

export default ActivityResultCard

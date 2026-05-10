import { formatCurrency } from '../../../utils/travelFormatters'

function BudgetAlerts({ trip }) {
  const overBudgetDays = trip.destinations.filter((stop) => {
    const stopCost = stop.activities.reduce((sum, activity) => sum + Number(activity.cost || 0), 0)
    return stopCost > Number(trip.budget.dailyLimit || 0)
  })

  return (
    <section className="panel-card">
      <h2>Alerts for over budget days</h2>
      {overBudgetDays.length ? (
        <div className="stack-list">
          {overBudgetDays.map((stop) => (
            <div key={stop.id} className="alert-card">
              <strong>{stop.city}</strong>
              <span>
                Activity total exceeded the day limit with{' '}
                {formatCurrency(
                  stop.activities.reduce((sum, activity) => sum + Number(activity.cost || 0), 0),
                )}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p className="muted-copy">No stop currently exceeds the daily budget target.</p>
      )}
    </section>
  )
}

export default BudgetAlerts

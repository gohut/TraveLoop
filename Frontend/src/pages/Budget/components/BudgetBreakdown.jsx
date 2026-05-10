import { formatCurrency, getTripDuration, getTripTotalBudget } from '../../../utils/travelFormatters'

function BudgetBreakdown({ trip }) {
  const chartItems = [
    { label: 'Transport', value: Number(trip.budget.transport || 0), color: '#d8b06d' },
    { label: 'Stay', value: Number(trip.budget.stay || 0), color: '#8ab6d6' },
    { label: 'Activities', value: Number(trip.budget.activities || 0), color: '#7ec4a5' },
    { label: 'Meals', value: Number(trip.budget.meals || 0), color: '#d78f86' },
  ]

  const totalBudget = getTripTotalBudget(trip)
  const avgPerDay = totalBudget / Math.max(1, getTripDuration(trip.startDate, trip.endDate))
  const overBudgetDays = trip.destinations.filter((stop) => {
    const stopCost = stop.activities.reduce((sum, activity) => sum + Number(activity.cost || 0), 0)
    return stopCost > Number(trip.budget.dailyLimit || 0)
  })

  let currentOffset = 0
  const donutSegments = chartItems.map((item) => {
    const percentage = totalBudget ? (item.value / totalBudget) * 100 : 0
    const segment = `${item.color} ${currentOffset}% ${currentOffset + percentage}%`
    currentOffset += percentage
    return segment
  })

  const donutStyle = {
    background: `conic-gradient(${donutSegments.join(', ')})`,
  }

  return (
    <section className="panel-grid panel-grid-2">
      <article className="panel-card">
        <div className="budget-chart-shell">
          <div className="budget-donut" style={donutStyle}>
            <div className="budget-donut-center">
              <strong>{formatCurrency(totalBudget)}</strong>
              <span>Total estimate</span>
            </div>
          </div>
          <div className="budget-legend">
            {chartItems.map((item) => (
              <div key={item.label} className="legend-row">
                <span className="legend-swatch" style={{ background: item.color }} />
                <span>{item.label}</span>
                <strong>{formatCurrency(item.value)}</strong>
              </div>
            ))}
          </div>
        </div>
      </article>

      <article className="panel-card panel-card-soft">
        <div className="metric-column">
          <div className="metric-card">
            <span>Average cost per day</span>
            <strong>{formatCurrency(avgPerDay)}</strong>
          </div>
          <div className="metric-card">
            <span>Daily target</span>
            <strong>{formatCurrency(trip.budget.dailyLimit)}</strong>
          </div>
          <div className="metric-card">
            <span>Over budget days</span>
            <strong>{overBudgetDays.length}</strong>
          </div>
        </div>
      </article>
    </section>
  )
}

export default BudgetBreakdown

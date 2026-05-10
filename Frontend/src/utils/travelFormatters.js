function formatDate(dateValue) {
  if (!dateValue) {
    return 'Date TBD'
  }

  return new Date(dateValue).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function formatShortDate(dateValue) {
  if (!dateValue) {
    return 'TBD'
  }

  return new Date(dateValue).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
  })
}

function formatDateRange(startDate, endDate) {
  if (!startDate && !endDate) {
    return 'Dates to be decided'
  }

  return `${formatShortDate(startDate)} - ${formatShortDate(endDate)}`
}

function formatCurrency(amount) {
  return `Rs. ${Number(amount || 0).toLocaleString('en-IN')}`
}

function getTripDuration(startDate, endDate) {
  if (!startDate || !endDate) {
    return 0
  }

  const start = new Date(startDate)
  const end = new Date(endDate)
  const diff = end.getTime() - start.getTime()

  return Math.max(1, Math.round(diff / (1000 * 60 * 60 * 24)) + 1)
}

function getTripTotalBudget(trip) {
  return (
    Number(trip.budget.transport || 0) +
    Number(trip.budget.stay || 0) +
    Number(trip.budget.activities || 0) +
    Number(trip.budget.meals || 0)
  )
}

function getDestinationCount(trip) {
  return trip.destinations.length
}

export {
  formatCurrency,
  formatDate,
  formatDateRange,
  formatShortDate,
  getDestinationCount,
  getTripDuration,
  getTripTotalBudget,
}

function QuickActionChips({ trips, onCreateTrip, onOpenProfile, onOpenBudget }) {
  return (
    <div className="dashboard-quick-actions">
      <button type="button" className="dashboard-chip" onClick={onCreateTrip}>
        Plan New Trip
      </button>
      <button type="button" className="dashboard-chip" onClick={onOpenProfile}>
        Review Wishlist
      </button>
      <button
        type="button"
        className="dashboard-chip"
        onClick={() => trips[0] && onOpenBudget(trips[0].id)}
      >
        Budget Snapshot
      </button>
    </div>
  )
}

export default QuickActionChips

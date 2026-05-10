function SavedDestinationsPanel({ savedDestinations, onToggleDestination }) {
  return (
    <aside className="panel-card panel-card-soft">
      <h2>Saved destinations</h2>
      <div className="saved-destination-list">
        {savedDestinations.map((destination) => (
          <div key={destination} className="saved-destination-chip">
            <span>{destination}</span>
            <button type="button" onClick={() => onToggleDestination(destination)}>
              Remove
            </button>
          </div>
        ))}
      </div>
    </aside>
  )
}

export default SavedDestinationsPanel

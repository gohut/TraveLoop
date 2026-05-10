function ActivityFilters({
  trip,
  selectedStopId,
  typeFilter,
  costFilter,
  durationFilter,
  typeOptions,
  onStopChange,
  onTypeChange,
  onCostChange,
  onDurationChange,
}) {
  return (
    <section className="panel-card">
      <div className="field-row field-row-stretch">
        <label className="field-group">
          <span>Stop</span>
          <select value={selectedStopId} onChange={(event) => onStopChange(event.target.value)}>
            {trip.destinations.map((stop) => (
              <option key={stop.id} value={stop.id}>
                {stop.city}
              </option>
            ))}
          </select>
        </label>

        <label className="field-group">
          <span>Type</span>
          <select value={typeFilter} onChange={(event) => onTypeChange(event.target.value)}>
            {typeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="field-group">
          <span>Cost</span>
          <select value={costFilter} onChange={(event) => onCostChange(event.target.value)}>
            <option value="All">All</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </label>

        <label className="field-group">
          <span>Duration</span>
          <select value={durationFilter} onChange={(event) => onDurationChange(event.target.value)}>
            <option value="All">All</option>
            <option value="Short">Short</option>
            <option value="Medium">Medium</option>
            <option value="Long">Long</option>
          </select>
        </label>
      </div>
    </section>
  )
}

export default ActivityFilters

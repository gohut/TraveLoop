function CitySearchFilters({
  searchText,
  regionFilter,
  countryFilter,
  regionOptions,
  countryOptions,
  onSearchChange,
  onRegionChange,
  onCountryChange,
}) {
  return (
    <section className="panel-card">
      <div className="field-row field-row-stretch">
        <label className="field-group">
          <span>Search</span>
          <input
            type="text"
            value={searchText}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search cities"
          />
        </label>
        <label className="field-group">
          <span>Region</span>
          <select value={regionFilter} onChange={(event) => onRegionChange(event.target.value)}>
            {regionOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <label className="field-group">
          <span>Country</span>
          <select value={countryFilter} onChange={(event) => onCountryChange(event.target.value)}>
            {countryOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>
    </section>
  )
}

export default CitySearchFilters

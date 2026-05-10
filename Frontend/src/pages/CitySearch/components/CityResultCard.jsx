function CityResultCard({ city, isSaved, onAdd, onToggleSave }) {
  return (
    <article className="panel-card city-card">
      <img src={city.image} alt={city.name} className="city-card-image" />
      <div className="city-card-body">
        <h2>{city.name}</h2>
        <p>
          {city.country} | {city.region}
        </p>
        <p>{city.highlight}</p>
        <div className="meta-row">
          <span>Cost: {city.costIndex}</span>
          <span>Popularity: {city.popularity}</span>
        </div>
        <div className="inline-actions">
          <button type="button" className="site-button site-button-primary" onClick={onAdd}>
            Add to Trip
          </button>
          <button type="button" className="site-button site-button-light" onClick={onToggleSave}>
            {isSaved ? 'Unsave' : 'Save'}
          </button>
        </div>
      </div>
    </article>
  )
}

export default CityResultCard

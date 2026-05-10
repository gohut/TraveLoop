function TripPreviewCard({ formState }) {
  return (
    <aside className="panel-card panel-card-soft preview-card">
      <p className="page-eyebrow">Live preview</p>
      {formState.coverPhoto ? (
        <img
          src={formState.coverPhoto}
          alt={formState.name || 'Trip cover'}
          className="preview-cover"
        />
      ) : (
        <div className="preview-placeholder">Optional cover photo</div>
      )}
      <h2>{formState.name || 'Trip name will appear here'}</h2>
      <p>{formState.destinationSummary || 'Destination summary'}</p>
      <p>{formState.description || 'The description will help set the tone for planning.'}</p>
    </aside>
  )
}

export default TripPreviewCard

function PublicSharePanel({ publicUrl }) {
  return (
    <section className="panel-card">
      <div className="section-row">
        <div>
          <p className="page-eyebrow">Public URL</p>
          <h2>{publicUrl}</h2>
        </div>
        <div className="inline-actions">
          <a
            className="site-button site-button-light"
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(publicUrl)}`}
            target="_blank"
            rel="noreferrer"
          >
            Share on X
          </a>
          <a
            className="site-button site-button-light"
            href={`https://wa.me/?text=${encodeURIComponent(publicUrl)}`}
            target="_blank"
            rel="noreferrer"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </section>
  )
}

export default PublicSharePanel

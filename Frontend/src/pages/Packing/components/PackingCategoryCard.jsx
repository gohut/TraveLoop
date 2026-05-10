function PackingCategoryCard({ group, tripId, onToggleItem, onRemoveItem }) {
  return (
    <article className="panel-card panel-card-soft">
      <div className="section-row">
        <h2>{group.category}</h2>
        <span>{group.items.length} items</span>
      </div>
      {group.items.length ? (
        <div className="stack-list">
          {group.items.map((item) => (
            <div key={item.id} className="checklist-row">
              <label className="checklist-label">
                <input
                  type="checkbox"
                  checked={item.packed}
                  onChange={() => onToggleItem(tripId, item.id)}
                />
                <span className={item.packed ? 'is-packed' : ''}>{item.label}</span>
              </label>
              <button
                type="button"
                className="mini-button danger"
                onClick={() => onRemoveItem(tripId, item.id)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="muted-copy">No items added in this category yet.</p>
      )}
    </article>
  )
}

export default PackingCategoryCard

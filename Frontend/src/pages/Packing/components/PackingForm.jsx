function PackingForm({
  itemLabel,
  itemCategory,
  onItemLabelChange,
  onItemCategoryChange,
  onSubmit,
}) {
  return (
    <form className="panel-card stack-form" onSubmit={onSubmit}>
      <h2>Add checklist item</h2>
      <label className="field-group">
        <span>Item</span>
        <input
          type="text"
          value={itemLabel}
          onChange={(event) => onItemLabelChange(event.target.value)}
          placeholder="Add item"
        />
      </label>
      <label className="field-group">
        <span>Category</span>
        <select value={itemCategory} onChange={(event) => onItemCategoryChange(event.target.value)}>
          <option value="Clothing">Clothing</option>
          <option value="Documents">Documents</option>
          <option value="Electronics">Electronics</option>
          <option value="Essentials">Essentials</option>
        </select>
      </label>
      <button type="submit" className="site-button site-button-primary">
        Add Item
      </button>
    </form>
  )
}

export default PackingForm

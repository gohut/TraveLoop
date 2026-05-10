import { Link } from 'react-router-dom'

function ManualStopForm({ stopForm, setStopForm, onSubmit, tripId }) {
  return (
    <form className="stack-form panel-card panel-card-soft" onSubmit={onSubmit}>
      <h2>Add manual stop</h2>
      <label className="field-group">
        <span>City</span>
        <input
          type="text"
          value={stopForm.city}
          onChange={(event) => setStopForm({ ...stopForm, city: event.target.value })}
          placeholder="Add Stop"
          required
        />
      </label>

      <div className="field-row">
        <label className="field-group">
          <span>Country</span>
          <input
            type="text"
            value={stopForm.country}
            onChange={(event) => setStopForm({ ...stopForm, country: event.target.value })}
            placeholder="Country"
          />
        </label>
        <label className="field-group">
          <span>Region</span>
          <input
            type="text"
            value={stopForm.region}
            onChange={(event) => setStopForm({ ...stopForm, region: event.target.value })}
            placeholder="Region"
          />
        </label>
      </div>

      <div className="field-row">
        <label className="field-group">
          <span>Start date</span>
          <input
            type="date"
            value={stopForm.startDate}
            onChange={(event) => setStopForm({ ...stopForm, startDate: event.target.value })}
          />
        </label>
        <label className="field-group">
          <span>End date</span>
          <input
            type="date"
            value={stopForm.endDate}
            onChange={(event) => setStopForm({ ...stopForm, endDate: event.target.value })}
          />
        </label>
      </div>

      <button type="submit" className="site-button site-button-primary">
        Save Stop
      </button>

      <Link className="site-inline-link" to={`/trips/${tripId}/cities`}>
        Or use City Search
      </Link>
    </form>
  )
}

export default ManualStopForm

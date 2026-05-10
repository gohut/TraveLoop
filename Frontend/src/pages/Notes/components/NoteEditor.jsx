function NoteEditor({ trip, draftNote, setDraftNote, editingNoteId, onSubmit }) {
  return (
    <form className="panel-card stack-form" onSubmit={onSubmit}>
      <h2>{editingNoteId ? 'Edit note' : 'Add note'}</h2>
      <label className="field-group">
        <span>Title</span>
        <input
          type="text"
          value={draftNote.title}
          onChange={(event) => setDraftNote({ ...draftNote, title: event.target.value })}
          placeholder="Hotel reminder"
        />
      </label>
      <label className="field-group">
        <span>Related stop</span>
        <select
          value={draftNote.stopId}
          onChange={(event) => setDraftNote({ ...draftNote, stopId: event.target.value })}
        >
          <option value="">General trip note</option>
          {trip.destinations.map((stop) => (
            <option key={stop.id} value={stop.id}>
              {stop.city}
            </option>
          ))}
        </select>
      </label>
      <label className="field-group">
        <span>Note</span>
        <textarea
          rows="7"
          value={draftNote.content}
          onChange={(event) => setDraftNote({ ...draftNote, content: event.target.value })}
          placeholder="Capture reminders, contacts, check-in info, or day-specific details."
        />
      </label>
      <button type="submit" className="site-button site-button-primary">
        {editingNoteId ? 'Update Note' : 'Save Note'}
      </button>
    </form>
  )
}

export default NoteEditor

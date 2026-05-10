import { formatDate } from '../../../utils/travelFormatters'

function NotesList({ notes, onEdit, onDelete }) {
  return (
    <div className="stack-list">
      {notes.map((note) => (
        <article key={note.id} className="panel-card panel-card-soft">
          <div className="section-row">
            <div>
              <h2>{note.title}</h2>
              <p>{formatDate(note.createdAt)}</p>
            </div>
            <div className="inline-actions">
              <button type="button" className="mini-button" onClick={() => onEdit(note)}>
                Edit
              </button>
              <button type="button" className="mini-button danger" onClick={() => onDelete(note.id)}>
                Delete
              </button>
            </div>
          </div>
          <p>{note.content}</p>
        </article>
      ))}
    </div>
  )
}

export default NotesList

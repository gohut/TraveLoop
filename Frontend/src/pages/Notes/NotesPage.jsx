import { useState } from 'react'
import { useParams } from 'react-router-dom'
import SiteLayout from '../../components/SiteLayout'
import TripWorkspaceNav from '../../components/TripWorkspaceNav'
import { useTravelApp } from '../../context/TravelAppContext'
import NoteEditor from './components/NoteEditor'
import NotesList from './components/NotesList'

function NotesPage() {
  const { tripId } = useParams()
  const { trips, addNote, updateNote, deleteNote } = useTravelApp()
  const trip = trips.find((item) => item.id === tripId)
  const [draftNote, setDraftNote] = useState({
    title: '',
    content: '',
    stopId: '',
  })
  const [editingNoteId, setEditingNoteId] = useState('')

  if (!trip) {
    return null
  }

  const sortedNotes = [...trip.notes].sort(
    (firstNote, secondNote) => new Date(secondNote.createdAt) - new Date(firstNote.createdAt),
  )

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!draftNote.title.trim() || !draftNote.content.trim()) {
      return
    }

    if (editingNoteId) {
      updateNote(trip.id, editingNoteId, draftNote)
      setEditingNoteId('')
    } else {
      addNote(trip.id, draftNote)
    }

    setDraftNote({
      title: '',
      content: '',
      stopId: '',
    })
  }

  const handleEdit = (note) => {
    setEditingNoteId(note.id)
    setDraftNote({
      title: note.title,
      content: note.content,
      stopId: note.stopId,
    })
  }

  return (
    <SiteLayout
      mapQuery={trip.destinationSummary}
      eyebrow="Trip notes and journal"
      title={`${trip.name} notes`}
      description="Write reminders, save day-specific details, and keep your travel journal attached to the trip."
    >
      <TripWorkspaceNav tripId={trip.id} />

      <section className="panel-grid panel-grid-2">
        <NoteEditor
          trip={trip}
          draftNote={draftNote}
          setDraftNote={setDraftNote}
          editingNoteId={editingNoteId}
          onSubmit={handleSubmit}
        />
        <NotesList notes={sortedNotes} onEdit={handleEdit} onDelete={(noteId) => deleteNote(trip.id, noteId)} />
      </section>
    </SiteLayout>
  )
}

export default NotesPage

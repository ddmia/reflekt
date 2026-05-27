import React, { useEffect, useState } from 'react'
import api from '../api/client'
import { Note } from '../types'

export default function NoteList({ taskId }: { taskId: number }) {
  const [notes, setNotes] = useState<Note[]>([])

  async function load() {
    const res = await api.get(`/tasks/${taskId}/notes`)
    setNotes(res.data)
  }

  useEffect(() => { load() }, [taskId])

  async function remove(id: number) {
    if (!confirm('Delete note?')) return
    await api.delete(`/notes/${id}`)
    load()
  }

  return (
    <div>
      <h4>Notes</h4>
      {notes.map(n => (
        <div key={n.id} style={{ borderBottom: '1px solid #eee', padding: 6 }}>
          <div>{n.content}</div>
          <small>{new Date(n.createdAt).toLocaleString()}</small>
          <div><button onClick={() => remove(n.id)}>Delete</button></div>
        </div>
      ))}
    </div>
  )
}

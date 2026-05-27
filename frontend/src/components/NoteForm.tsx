import React, { useState } from 'react'
import api from '../api/client'

export default function NoteForm({ taskId, onCreated }: { taskId: number; onCreated: () => void }) {
  const [content, setContent] = useState('')

  async function create(e: React.FormEvent) {
    e.preventDefault()
    await api.post('/notes', { taskId, content })
    setContent('')
    onCreated()
  }

  return (
    <form onSubmit={create} style={{ marginTop: 8 }}>
      <input value={content} onChange={e => setContent(e.target.value)} placeholder="Note content" required />
      <button type="submit">Add Note</button>
    </form>
  )
}

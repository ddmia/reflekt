import React, { useState } from 'react'
import api from '../api/client'

export default function TaskForm({ onCreated }: { onCreated: () => void }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  async function create(e: React.FormEvent) {
    e.preventDefault();
    await api.post('/tasks', { title, description });
    setTitle(''); setDescription('');
    onCreated();
  }

  return (
    <form onSubmit={create} className="task-form">
      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" required />
      <input value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" />
      <button type="submit">Create</button>
    </form>
  )
}

import React, { useEffect, useState } from 'react'
import api from '../api/client'
import { Tag } from '../types'

export default function TagManager({ taskId, onUpdated }: { taskId: number; onUpdated: () => void }) {
  const [tags, setTags] = useState<Tag[]>([])
  const [name, setName] = useState('')
  const [color, setColor] = useState('#666666')

  async function load() {
    const res = await api.get('/tags')
    setTags(res.data)
  }

  useEffect(() => { load() }, [])

  async function create(e: React.FormEvent) {
    e.preventDefault()
    await api.post('/tags', { name, color })
    setName('')
    load()
  }

  async function toggle(tag: Tag) {
    // naive: try attach, if 204 then ok; else detach
    try {
      await api.post(`/tasks/${taskId}/tags/${tag.id}`)
    } catch {
      await api.delete(`/tasks/${taskId}/tags/${tag.id}`)
    }
    onUpdated()
    load()
  }

  return (
    <div>
      <h4>Tags</h4>
      <form onSubmit={create} style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="tag name" required />
        <input value={color} onChange={e => setColor(e.target.value)} type="color" />
        <button type="submit">Create</button>
      </form>
      <div>
        {tags.map(t => (
          <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 12, height: 12, background: t.color }} />
            <div>{t.name}</div>
            <div><button onClick={() => toggle(t)}>Toggle for task</button></div>
          </div>
        ))}
      </div>
    </div>
  )
}

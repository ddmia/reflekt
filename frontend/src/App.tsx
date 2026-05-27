import React, { useEffect, useState } from 'react'
import api from './api/client'
import { Task } from './types'

import TaskList from './components/TaskList'
import TaskForm from './components/TaskForm'
import NoteList from './components/NoteList'
import NoteForm from './components/NoteForm'
import TagManager from './components/TagManager'

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Task | null>(null);
  const [filters, setFilters] = useState<{status?: string, priority?: string}>({});

  async function load() {
    setLoading(true);
    const res = await api.get('/tasks', { params: filters });
    setTasks(res.data as Task[]);
    setLoading(false);
  }

  useEffect(() => { load(); }, [filters]);

  return (
    <div className="app">
      <h1>Reflekt — Tasks</h1>
      <div style={{ marginBottom: 12 }}>
        <label>Status: <select onChange={e => setFilters(f => ({ ...f, status: e.target.value || undefined }))}>
          <option value="">All</option>
          <option value="TODO">TODO</option>
          <option value="IN_PROGRESS">IN_PROGRESS</option>
          <option value="DONE">DONE</option>
        </select></label>
        <label style={{ marginLeft: 12 }}>Priority: <select onChange={e => setFilters(f => ({ ...f, priority: e.target.value || undefined }))}>
          <option value="">All</option>
          <option value="LOW">LOW</option>
          <option value="MEDIUM">MEDIUM</option>
          <option value="HIGH">HIGH</option>
          <option value="URGENT">URGENT</option>
        </select></label>
      </div>
      <div className="main">
        <div className="left">
          <TaskForm onCreated={load} />
          {loading ? <div>Loading...</div> : <TaskList tasks={tasks} onRefresh={load} onSelect={t => setSelected(t)} />}
        </div>
        <div className="right">
          {selected ? (
            <div>
              <h3>{selected.title}</h3>
              <div>{selected.description}</div>
              <NoteForm taskId={selected.id} onCreated={() => load()} />
              <NoteList taskId={selected.id} />
              <div style={{ marginTop: 12 }}>
                <TagManager taskId={selected.id} onUpdated={() => load()} />
              </div>
            </div>
          ) : (
            <p>Select a task to see details</p>
          )}
        </div>
      </div>
    </div>
  )
}

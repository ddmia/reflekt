import React, { useEffect, useState } from 'react';
import { fetchTasks, createTask, addNote } from './api';
import { TaskDTO } from './types';

export default function App() {
  const [tasks, setTasks] = useState<TaskDTO[]>([]);
  const [title, setTitle] = useState('');
  const [noteText, setNoteText] = useState('');
  const [selectedTask, setSelectedTask] = useState<string | null>(null);

  async function load() {
    const data = await fetchTasks();
    setTasks(data);
  }

  useEffect(() => { load(); }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!title) return;
    await createTask({ title });
    setTitle('');
    load();
  }

  async function handleAddNote(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedTask || !noteText) return;
    await addNote(selectedTask, noteText);
    setNoteText('');
    load();
  }

  return (
    <div className="app">
      <h1>Task Manager</h1>
      <form onSubmit={handleCreate} className="form-row">
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="New task title" />
        <button type="submit">Add</button>
      </form>

      <div className="tasks">
        {tasks.map(t => (
          <div key={t.id} className="task">
            <div className="task-head">
              <strong>{t.title}</strong>
              <small>{t.priority}</small>
            </div>
            <div className="task-body">{t.description}</div>
            <div className="task-tags">Tags: {t.tags.join(', ')}</div>
            <div className="task-notes">
              <em>Notes:</em>
              <ul>
                {t.notes.map(n => <li key={n.id}>{n.text} <small>{new Date(n.createdAt).toLocaleString()}</small></li>)}
              </ul>
            </div>
            <div className="task-actions">
              <button onClick={() => setSelectedTask(t.id)}>Add note</button>
            </div>
          </div>
        ))}
      </div>

      {selectedTask && (
        <form onSubmit={handleAddNote} className="form-row note-row">
          <input value={noteText} onChange={e => setNoteText(e.target.value)} placeholder="Note text" />
          <button type="submit">Add Note</button>
          <button type="button" onClick={() => setSelectedTask(null)}>Cancel</button>
        </form>
      )}
    </div>
  );
}

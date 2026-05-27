import React from 'react'
import { Task } from '../types'
import api from '../api/client'
import TagBadge from './TagBadge'
import PriorityBadge from './PriorityBadge'

export default function TaskCard({ task, onRefresh, onSelect }: { task: Task; onRefresh: () => void; onSelect?: (t: Task) => void }) {
  async function remove() {
    if (!confirm('Delete task?')) return;
    await api.delete(`/tasks/${task.id}`);
    onRefresh();
  }

  return (
    <div className="card" onClick={() => onSelect?.(task)} style={{ cursor: onSelect ? 'pointer' : 'default' }}>
      <h3>{task.title}</h3>
      <div>{task.description}</div>
      <div style={{ margin: '6px 0' }}>{task.tags?.map(t => <TagBadge key={t.id} tag={t} />)}</div>
      <small><PriorityBadge priority={task.priority} /> &nbsp; {task.status}</small>
      <div className="card-actions">
        <button onClick={(e) => { e.stopPropagation(); remove(); }}>Delete</button>
      </div>
    </div>
  )
}

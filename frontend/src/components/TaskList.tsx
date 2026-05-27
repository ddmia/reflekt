import React from 'react'
import { Task } from '../types'
import TaskCard from './TaskCard'

export default function TaskList({ tasks, onRefresh, onSelect }: { tasks: Task[]; onRefresh: () => void; onSelect?: (t: Task) => void }) {
  return (
    <div>
      {tasks.map(t => <TaskCard key={t.id} task={t} onRefresh={onRefresh} onSelect={onSelect} />)}
    </div>
  )
}

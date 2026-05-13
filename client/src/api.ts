import { TaskDTO } from './types';

const BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:4000/api';

export async function fetchTasks(): Promise<TaskDTO[]> {
  const res = await fetch(`${BASE}/tasks`);
  return res.json();
}

export async function createTask(payload: { title: string; description?: string }) {
  const res = await fetch(`${BASE}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function addNote(taskId: string, text: string) {
  const res = await fetch(`${BASE}/tasks/${taskId}/notes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  return res.json();
}

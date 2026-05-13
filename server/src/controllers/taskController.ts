import { Request, Response } from 'express';
import { taskRepo } from '../repositories/taskRepository';

export async function listTasks(req: Request, res: Response) {
  const tasks = await taskRepo.getAll();
  res.json(tasks);
}

export async function createTask(req: Request, res: Response) {
  const { title, description, tags, priority } = req.body;
  if (!title) return res.status(400).json({ error: 'title is required' });
  const task = await taskRepo.create({ title, description, tags, priority });
  res.status(201).json(task);
}

export async function getTask(req: Request, res: Response) {
  const id = req.params.id;
  const task = await taskRepo.getById(id);
  if (!task) return res.status(404).json({ error: 'not found' });
  res.json(task);
}

export async function updateTask(req: Request, res: Response) {
  const id = req.params.id;
  const updated = await taskRepo.update(id, req.body);
  if (!updated) return res.status(404).json({ error: 'not found' });
  res.json(updated);
}

export async function deleteTask(req: Request, res: Response) {
  const id = req.params.id;
  const ok = await taskRepo.delete(id);
  if (!ok) return res.status(404).json({ error: 'not found' });
  res.status(204).send();
}

export async function addNote(req: Request, res: Response) {
  const id = req.params.id;
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'text is required' });
  const note = await taskRepo.addNote(id, text);
  if (!note) return res.status(404).json({ error: 'task not found' });
  res.status(201).json(note);
}

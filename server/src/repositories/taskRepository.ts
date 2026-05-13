import { TaskDTO, CreateTaskDTO, UpdateTaskDTO, NoteDTO } from '../dtos/taskDTO';

function makeId() {
  return (Date.now().toString(36) + Math.random().toString(36).slice(2, 8));
}

export class TaskRepository {
  private tasks: TaskDTO[] = [];

  async create(data: CreateTaskDTO): Promise<TaskDTO> {
    const now = new Date().toISOString();
    const task: TaskDTO = {
      id: makeId(),
      title: data.title,
      description: data.description,
      tags: data.tags ?? [],
      priority: data.priority ?? 'medium',
      notes: [],
      createdAt: now,
      updatedAt: now,
    };
    this.tasks.push(task);
    return task;
  }

  async getAll(): Promise<TaskDTO[]> {
    return [...this.tasks];
  }

  async getById(id: string): Promise<TaskDTO | null> {
    return this.tasks.find(t => t.id === id) ?? null;
  }

  async update(id: string, patch: UpdateTaskDTO): Promise<TaskDTO | null> {
    const t = await this.getById(id);
    if (!t) return null;
    t.title = patch.title ?? t.title;
    t.description = patch.description ?? t.description;
    t.tags = patch.tags ?? t.tags;
    t.priority = patch.priority ?? t.priority;
    t.updatedAt = new Date().toISOString();
    return t;
  }

  async delete(id: string): Promise<boolean> {
    const before = this.tasks.length;
    this.tasks = this.tasks.filter(t => t.id !== id);
    return this.tasks.length < before;
  }

  async addNote(taskId: string, text: string): Promise<NoteDTO | null> {
    const t = await this.getById(taskId);
    if (!t) return null;
    const note: NoteDTO = { id: makeId(), text, createdAt: new Date().toISOString() };
    t.notes.push(note);
    t.updatedAt = new Date().toISOString();
    return note;
  }
}

export const taskRepo = new TaskRepository();

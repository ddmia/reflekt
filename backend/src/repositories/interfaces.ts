import { Task, Note, Tag } from '../domain/types';

export interface ITaskRepository {
  create(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>, tags?: string[]): Promise<Task>;
  findAll(filters?: Partial<Pick<Task, 'status' | 'priority'>>): Promise<Task[]>;
  findById(id: number): Promise<Task | null>;
  update(id: number, patch: Partial<Task>, tags?: string[]): Promise<Task>;
  delete(id: number): Promise<void>;
}

export interface INoteRepository {
  create(note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Promise<Note>;
  findByTask(taskId: number): Promise<Note[]>;
  findById(id: number): Promise<Note | null>;
  update(id: number, content: string): Promise<Note>;
  delete(id: number): Promise<void>;
}

export interface ITagRepository {
  create(name: string, color: string): Promise<Tag>;
  findByName(name: string): Promise<Tag | null>;
  findById(id: number): Promise<Tag | null>;
  list(): Promise<Tag[]>;
  listByTask(taskId: number): Promise<Tag[]>;
  attachToTask(taskId: number, tagId: number): Promise<void>;
  detachFromTask(taskId: number, tagId: number): Promise<void>;
}

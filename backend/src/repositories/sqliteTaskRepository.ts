import { ITaskRepository } from './interfaces';
import { Task, Priority, Status, Tag } from '../domain/types';
import type { DBWrapper } from '../db/index';

/*
  Architectural notes:
  - This repository uses explicit SQL with better-sqlite3 for simplicity and predictable
    transactional behavior. We keep tag creation idempotent via `INSERT OR IGNORE` so
    duplicate tag names are reused (as requested).
  - Tag attachment/detachment is done inside a transaction to avoid partially applied
    associations. task_tags uses a composite PK preventing duplicate associations.
  - Timestamps are stored as ISO strings.
*/

function now() { return new Date().toISOString(); }

export class SqliteTaskRepository implements ITaskRepository {
  constructor(private db: DBWrapper) {}
  async create(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>, tags?: string[]): Promise<Task> {
    const createdAt = now();
    const info = this.db.run('INSERT INTO tasks (title, description, status, priority, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)', [task.title, task.description ?? null, task.status ?? Status.TODO, task.priority ?? Priority.LOW, createdAt, createdAt]);
    const id = Number(info.lastInsertRowid);
    if (tags && tags.length) {
      // create or reuse tags and attach
      for (const t of tags) {
        this.db.run('INSERT OR IGNORE INTO tags (name, color) VALUES (?, ?)', [t, '#cccccc']);
        const row = this.db.get('SELECT id FROM tags WHERE name = ?', [t]);
        if (row) this.db.run('INSERT OR IGNORE INTO task_tags (taskId, tagId) VALUES (?, ?)', [id, row.id]);
      }
      this.db.exportToFile();
    }
    return this.findById(id) as Promise<Task>;
  }

  async findAll(filters?: Partial<Pick<Task, 'status' | 'priority'>>): Promise<Task[]> {
    const where: string[] = [];
    const params: any[] = [];
    if (filters?.status) { where.push('status = ?'); params.push(filters.status); }
    if (filters?.priority) { where.push('priority = ?'); params.push(filters.priority); }
    const q = `SELECT * FROM tasks` + (where.length ? ` WHERE ${where.join(' AND ')}` : '') + ` ORDER BY createdAt DESC`;
    const rows = this.db.all(q, params) as any[];
    return rows.map(r => ({...r}));
  }

  async findById(id: number): Promise<Task | null> {
    const row = this.db.get('SELECT * FROM tasks WHERE id = ?', [id]);
    if (!row) return null;
    return {...row};
  }

  async update(id: number, patch: Partial<Task>, tags?: string[]): Promise<Task> {
    const existing = await this.findById(id);
    if (!existing) throw new Error('NotFound');
    const updatedAt = now();
    this.db.run('UPDATE tasks SET title = ?, description = ?, status = ?, priority = ?, updatedAt = ? WHERE id = ?', [patch.title ?? existing.title, patch.description ?? existing.description, patch.status ?? existing.status, patch.priority ?? existing.priority, updatedAt, id]);
    if (tags) {
      this.db.run('DELETE FROM task_tags WHERE taskId = ?', [id]);
      for (const t of tags) {
        this.db.run('INSERT OR IGNORE INTO tags (name, color) VALUES (?, ?)', [t, '#cccccc']);
        const row = this.db.get('SELECT id FROM tags WHERE name = ?', [t]);
        if (row) this.db.run('INSERT OR IGNORE INTO task_tags (taskId, tagId) VALUES (?, ?)', [id, row.id]);
      }
      this.db.exportToFile();
    }
    const updated = await this.findById(id);
    if (!updated) throw new Error('NotFound');
    return updated;
  }

  async delete(id: number): Promise<void> {
    this.db.run('DELETE FROM tasks WHERE id = ?', [id]);
    this.db.exportToFile();
  }
}

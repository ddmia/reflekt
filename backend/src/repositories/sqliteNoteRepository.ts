import { INoteRepository } from './interfaces';
import { Note } from '../domain/types';
import type { DBWrapper } from '../db/index';

// Notes repository: simple CRUD. Relies on DB FK cascade so task deletion removes notes.
function now() { return new Date().toISOString(); }

export class SqliteNoteRepository implements INoteRepository {
  constructor(private db: DBWrapper) {}
  async create(note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Promise<Note> {
    const createdAt = now();
    const info = this.db.run('INSERT INTO notes (taskId, content, createdAt, updatedAt) VALUES (?, ?, ?, ?)', [note.taskId, note.content, createdAt, createdAt]);
    const id = Number(info.lastInsertRowid);
    this.db.exportToFile();
    return this.db.get('SELECT * FROM notes WHERE id = ?', [id]);
  }

  async findByTask(taskId: number): Promise<Note[]> {
    return this.db.all('SELECT * FROM notes WHERE taskId = ? ORDER BY createdAt DESC', [taskId]);
  }

  async findById(id: number): Promise<Note | null> {
    return this.db.get('SELECT * FROM notes WHERE id = ?', [id]) ?? null;
  }

  async update(id: number, content: string): Promise<Note> {
    const updatedAt = now();
    this.db.run('UPDATE notes SET content = ?, updatedAt = ? WHERE id = ?', [content, updatedAt, id]);
    this.db.exportToFile();
    const row = this.db.get('SELECT * FROM notes WHERE id = ?', [id]);
    if (!row) throw new Error('NotFound');
    return row;
  }

  async delete(id: number): Promise<void> {
    this.db.run('DELETE FROM notes WHERE id = ?', [id]);
    this.db.exportToFile();
  }
}

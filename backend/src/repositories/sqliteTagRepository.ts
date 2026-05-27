import { ITagRepository } from './interfaces';
import { Tag } from '../domain/types';
import type { DBWrapper } from '../db/index';

// Tags repository: tags are unique by name. Color is provided but defaulted by services
// when creating from task payloads. findByName helps reuse existing tags to avoid duplicates.
export class SqliteTagRepository implements ITagRepository {
  constructor(private db: DBWrapper) {}

  async create(name: string, color: string): Promise<Tag> {
    this.db.run('INSERT OR IGNORE INTO tags (name, color) VALUES (?, ?)', [name, color]);
    this.db.exportToFile();
    const row = this.db.get('SELECT * FROM tags WHERE name = ?', [name]);
    return row;
  }

  async findByName(name: string): Promise<Tag | null> {
    return this.db.get('SELECT * FROM tags WHERE name = ?', [name]) ?? null;
  }

  async findById(id: number): Promise<Tag | null> {
    return this.db.get('SELECT * FROM tags WHERE id = ?', [id]) ?? null;
  }

  async list(): Promise<Tag[]> {
    return this.db.all('SELECT * FROM tags ORDER BY name');
  }

  async listByTask(taskId: number): Promise<Tag[]> {
    return this.db.all(`SELECT t.* FROM tags t JOIN task_tags tt ON tt.tagId = t.id WHERE tt.taskId = ? ORDER BY t.name`, [taskId]);
  }

  async attachToTask(taskId: number, tagId: number): Promise<void> {
    this.db.run('INSERT OR IGNORE INTO task_tags (taskId, tagId) VALUES (?, ?)', [taskId, tagId]);
    this.db.exportToFile();
  }

  async detachFromTask(taskId: number, tagId: number): Promise<void> {
    this.db.run('DELETE FROM task_tags WHERE taskId = ? AND tagId = ?', [taskId, tagId]);
    this.db.exportToFile();
  }
}

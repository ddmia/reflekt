import { INoteRepository } from '../repositories/interfaces';

export class NoteService {
  constructor(private notes: INoteRepository) {}

  async create(taskId: number, content: string) {
    return this.notes.create({ taskId, content });
  }

  async listByTask(taskId: number) { return this.notes.findByTask(taskId); }

  async update(id: number, content: string) { return this.notes.update(id, content); }

  async delete(id: number) { return this.notes.delete(id); }
}

import { ITagRepository } from '../repositories/interfaces';

export class TagService {
  constructor(private tags: ITagRepository) {}

  async create(name: string, color: string) { return this.tags.create(name, color); }

  async list() { return this.tags.list(); }

  async attach(taskId: number, tagId: number) { return this.tags.attachToTask(taskId, tagId); }

  async detach(taskId: number, tagId: number) { return this.tags.detachFromTask(taskId, tagId); }
}

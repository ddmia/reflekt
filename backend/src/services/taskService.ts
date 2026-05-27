import { ITaskRepository, ITagRepository, INoteRepository } from '../repositories/interfaces';
import { Task } from '../domain/types';

/*
  TaskService now composes TaskResponse objects by combining task rows with
  their tags and notes. Repositories remain small and focused; the service
  composes the richer DTOs required by the controllers.
*/
export class TaskService {
  constructor(private tasks: ITaskRepository, private tags: ITagRepository, private notes: INoteRepository) {}

  private async attachTagsIfNeeded(tagNames?: string[]) {
    if (tagNames && tagNames.length) {
      for (const t of tagNames) {
        await this.tags.create(t, '#cccccc');
      }
    }
  }

  async create(payload: Omit<Task, 'id'|'createdAt'|'updatedAt'>, tagNames?: string[]) {
    await this.attachTagsIfNeeded(tagNames);
    const created = await this.tasks.create(payload, tagNames);
    // enrich with tags and notes
    const tags = await this.tags.listByTask(created.id);
    const notes = await this.notes.findByTask(created.id);
    return { ...created, tags, notes };
  }

  async list(filters?: Partial<Pick<Task, 'status'|'priority'>>) {
    const tasks = await this.tasks.findAll(filters);
    const enriched = await Promise.all(tasks.map(async t => {
      const tags = await this.tags.listByTask(t.id);
      const notes = await this.notes.findByTask(t.id);
      return { ...t, tags, notes };
    }));
    return enriched;
  }

  async get(id: number) {
    const t = await this.tasks.findById(id);
    if (!t) throw new Error('NotFound');
    const tags = await this.tags.listByTask(t.id);
    const notes = await this.notes.findByTask(t.id);
    return { ...t, tags, notes };
  }

  async update(id: number, patch: Partial<Task>, tags?: string[]) {
    await this.attachTagsIfNeeded(tags);
    const updated = await this.tasks.update(id, patch, tags);
    const tagList = await this.tags.listByTask(id);
    const notes = await this.notes.findByTask(id);
    return { ...updated, tags: tagList, notes };
  }

  async delete(id: number) {
    return this.tasks.delete(id);
  }
}

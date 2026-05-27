import { Task } from '../domain/Task';
import { CreateTaskDto, UpdateTaskDto, TaskResponseDto } from '../dtos/task.dto';

export interface ITaskRepository {
  findAll(filters?: { status?: string; priority?: string; tag?: string }): TaskResponseDto[];
  findById(id: number): TaskResponseDto | null;
  create(dto: CreateTaskDto): TaskResponseDto;
  update(id: number, dto: UpdateTaskDto): TaskResponseDto | null;
  delete(id: number): boolean;
}

export class InMemoryTaskRepository implements ITaskRepository {
  private tasks: Task[] = [];
  private nextId = 1;

  findAll(filters?: { status?: string; priority?: string; tag?: string }): TaskResponseDto[] {
    let results = this.tasks.slice();
    if (filters) {
      if (filters.status) results = results.filter(t => t.status === filters.status);
      if (filters.priority) results = results.filter(t => t.priority === filters.priority);
      if (filters.tag) results = results.filter(t => t.tags.includes(filters.tag!));
    }
    return results.map(t => ({ ...t }));
  }

  findById(id: number): TaskResponseDto | null {
    const t = this.tasks.find(x => x.id === id);
    return t ? { ...t } : null;
  }

  create(dto: CreateTaskDto): TaskResponseDto {
    const now = new Date().toISOString();
    const task: Task = {
      id: this.nextId++,
      title: dto.title,
      description: dto.description ?? '',
      status: 'TODO',
      priority: (dto.priority as any) ?? 'LOW',
      tags: dto.tags ?? [],
      created_at: now,
      updated_at: now,
    };
    this.tasks.push(task);
    return { ...task };
  }

  update(id: number, dto: UpdateTaskDto): TaskResponseDto | null {
    const idx = this.tasks.findIndex(x => x.id === id);
    if (idx === -1) return null;
    const existing = this.tasks[idx];
    const updated: Task = {
      ...existing,
      title: dto.title ?? existing.title,
      description: dto.description ?? existing.description,
      status: (dto.status as any) ?? existing.status,
      priority: (dto.priority as any) ?? existing.priority,
      tags: dto.tags ?? existing.tags,
      updated_at: new Date().toISOString(),
    };
    this.tasks[idx] = updated;
    return { ...updated };
  }

  delete(id: number): boolean {
    const idx = this.tasks.findIndex(x => x.id === id);
    if (idx === -1) return false;
    this.tasks.splice(idx, 1);
    return true;
  }
}

import { Task, TaskPriority, TaskStatus } from '../domain/Task';
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
    let result = this.tasks.slice();
    if (filters) {
      if (filters.status) result = result.filter(t => t.status === (filters.status as TaskStatus));
      if (filters.priority) result = result.filter(t => t.priority === (filters.priority as TaskPriority));
      if (filters.tag) result = result.filter(t => t.tags.includes(filters.tag!));
    }
    return result;
  }

  findById(id: number): TaskResponseDto | null {
    const t = this.tasks.find(x => x.id === id);
    return t || null;
  }

  create(dto: CreateTaskDto): TaskResponseDto {
    const now = new Date().toISOString();
    const task: Task = {
      id: this.nextId++,
      title: dto.title,
      description: dto.description ?? '',
      status: 'TODO',
      priority: (dto.priority as TaskPriority) ?? 'LOW',
      tags: dto.tags ?? [],
      created_at: now,
      updated_at: now,
    };
    this.tasks.push(task);
    return task;
  }

  update(id: number, dto: UpdateTaskDto): TaskResponseDto | null {
    const task = this.tasks.find(x => x.id === id);
    if (!task) return null;
    if (dto.title !== undefined) task.title = dto.title;
    if (dto.description !== undefined) task.description = dto.description;
    if (dto.status !== undefined) task.status = dto.status as TaskStatus;
    if (dto.priority !== undefined) task.priority = dto.priority as TaskPriority;
    if (dto.tags !== undefined) task.tags = dto.tags;
    task.updated_at = new Date().toISOString();
    return task;
  }

  delete(id: number): boolean {
    const idx = this.tasks.findIndex(x => x.id === id);
    if (idx === -1) return false;
    this.tasks.splice(idx, 1);
    return true;
  }
}

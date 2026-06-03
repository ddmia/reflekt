import { Task, TaskPriority, TaskStatus } from '../domain/Task';

export interface CreateTaskDto {
  title: string;
  description?: string;
  priority?: string;
  tags?: string[];
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  status?: string;
  priority?: string;
  tags?: string[];
}

export type TaskResponseDto = Task;

import { TaskStatus, TaskPriority } from '../domain/Task';

export type CreateTaskDto = {
  title: string;
  description?: string;
  priority?: TaskPriority | string;
  tags?: string[];
};

export type UpdateTaskDto = {
  title?: string;
  description?: string;
  status?: TaskStatus | string;
  priority?: TaskPriority | string;
  tags?: string[];
};

export type TaskResponseDto = {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  tags: string[];
  created_at: string;
  updated_at: string;
};

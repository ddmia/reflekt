export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

export enum Status {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE'
}

export interface Task {
  id: number;
  title: string;
  description?: string | null;
  status: Status;
  priority: Priority;
  createdAt: string;
  updatedAt: string;
}

export interface Note {
  id: number;
  taskId: number;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface Tag {
  id: number;
  name: string;
  color: string;
}

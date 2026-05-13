export type Priority = 'low' | 'medium' | 'high';

export interface NoteDTO {
  id: string;
  text: string;
  createdAt: string;
}

export interface TaskDTO {
  id: string;
  title: string;
  description?: string;
  tags: string[];
  priority: Priority;
  notes: NoteDTO[];
  createdAt: string;
  updatedAt?: string;
}

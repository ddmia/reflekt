export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type Status = 'TODO' | 'IN_PROGRESS' | 'DONE';

export interface Tag { id: number; name: string; color: string }
export interface Note { id: number; taskId: number; content: string; createdAt: string; updatedAt: string }
export interface Task { id: number; title: string; description?: string | null; status: Status; priority: Priority; createdAt: string; updatedAt: string; tags?: Tag[]; notes?: Note[] }

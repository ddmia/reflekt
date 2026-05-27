import { z } from 'zod';
import { Priority, Status } from '../domain/types';

export const CreateTaskDto = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  status: z.nativeEnum(Status).optional(),
  priority: z.nativeEnum(Priority).optional(),
  tags: z.array(z.string()).optional()
});

export const UpdateTaskDto = CreateTaskDto.partial();

export const CreateNoteDto = z.object({
  taskId: z.number(),
  content: z.string().min(1)
});

export const UpdateNoteDto = z.object({
  content: z.string().min(1)
});

export const CreateTagDto = z.object({
  name: z.string().min(1),
  color: z.string().regex(/^#([0-9A-Fa-f]{6})$/)
});

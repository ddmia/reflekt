import { Request, Response, NextFunction } from 'express';
import { CreateNoteDto, UpdateNoteDto } from '../dtos/input';
import { NoteService } from '../services/noteService';

export function makeNoteController(service: NoteService) {
  return {
    async create(req: Request, res: Response, next: NextFunction) {
      try {
        const parsed = CreateNoteDto.parse(req.body);
        const created = await service.create(parsed.taskId, parsed.content);
        res.status(201).json(created);
      } catch (err) { next(err); }
    },

    async listByTask(req: Request, res: Response, next: NextFunction) {
      try {
        const taskId = Number(req.params.taskId);
        const notes = await service.listByTask(taskId);
        res.json(notes);
      } catch (err) { next(err); }
    },

    async update(req: Request, res: Response, next: NextFunction) {
      try {
        const id = Number(req.params.id);
        const parsed = UpdateNoteDto.parse(req.body);
        const updated = await service.update(id, parsed.content);
        res.json(updated);
      } catch (err) { next(err); }
    },

    async remove(req: Request, res: Response, next: NextFunction) {
      try {
        const id = Number(req.params.id);
        await service.delete(id);
        res.status(204).send();
      } catch (err) { next(err); }
    }
  };
}

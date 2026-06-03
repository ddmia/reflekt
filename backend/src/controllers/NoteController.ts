import { Request, Response, NextFunction } from 'express';
import { NoteService } from '../services/NoteService';
import { CreateNoteDto, UpdateNoteDto } from '../dtos/note.dto';

export class NoteController {
  constructor(private service: NoteService) {}

  listByTask = (req: Request, res: Response, next: NextFunction) => {
    try {
      const taskId = Number(req.params.taskId);
      const notes = this.service.findByTaskId(taskId);
      res.json(notes);
    } catch (err) {
      next(err);
    }
  };

  create = (req: Request, res: Response, next: NextFunction) => {
    try {
      const taskId = Number(req.params.taskId);
      const dto: CreateNoteDto = req.body;
      if (!dto.content) return res.status(422).json({ error: 'content é obrigatório' });
      const note = this.service.create(taskId, dto);
      res.status(201).json(note);
    } catch (err) {
      next(err);
    }
  };

  update = (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const dto: UpdateNoteDto = req.body;
      if (!dto.content) return res.status(422).json({ error: 'content é obrigatório' });
      const note = this.service.update(id, dto);
      if (!note) return res.status(404).json({ error: 'Nota não encontrada' });
      res.json(note);
    } catch (err) {
      next(err);
    }
  };

  delete = (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const ok = this.service.delete(id);
      if (!ok) return res.status(404).json({ error: 'Nota não encontrada' });
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  };
}

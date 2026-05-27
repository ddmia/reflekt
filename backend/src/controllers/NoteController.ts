import { Request, Response, NextFunction } from 'express';
import { NoteService } from '../services/NoteService';

export class NoteController {
  constructor(private noteService: NoteService) {}

  list = (req: Request, res: Response, next: NextFunction) => {
    try {
      const taskId = Number(req.params.taskId);
      const notes = this.noteService.listByTask(taskId);
      res.json(notes);
    } catch (err) {
      next(err);
    }
  };

  create = (req: Request, res: Response, next: NextFunction) => {
    try {
      const taskId = Number(req.params.taskId);
      const dto = req.body;
      if (!dto.content) return res.status(422).json({ error: 'content é obrigatório' });
      const note = this.noteService.create(taskId, dto);
      res.status(201).json(note);
    } catch (err) {
      next(err);
    }
  };

  update = (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const dto = req.body;
      if (!dto.content) return res.status(422).json({ error: 'content é obrigatório' });
      const note = this.noteService.update(id, dto);
      if (!note) return res.status(404).json({ error: 'Nota não encontrada' });
      res.json(note);
    } catch (err) {
      next(err);
    }
  };

  delete = (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const ok = this.noteService.delete(id);
      if (!ok) return res.status(404).json({ error: 'Nota não encontrada' });
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  };
}

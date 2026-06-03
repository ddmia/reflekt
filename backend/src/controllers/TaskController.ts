import { Request, Response, NextFunction } from 'express';
import { TaskService } from '../services/TaskService';
import { CreateTaskDto, UpdateTaskDto } from '../dtos/task.dto';

export class TaskController {
  constructor(private service: TaskService) {}

  list = (req: Request, res: Response, next: NextFunction) => {
    try {
      const filters: any = {};
      if (req.query.status) filters.status = String(req.query.status);
      if (req.query.priority) filters.priority = String(req.query.priority);
      if (req.query.tag) filters.tag = String(req.query.tag);
      const tasks = this.service.findAll(filters);
      res.json(tasks);
    } catch (err) {
      next(err);
    }
  };

  get = (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const task = this.service.findById(id);
      if (!task) return res.status(404).json({ error: 'Tarefa não encontrada' });
      res.json(task);
    } catch (err) {
      next(err);
    }
  };

  create = (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto: CreateTaskDto = req.body;
      if (!dto.title) return res.status(422).json({ error: 'title é obrigatório' });
      const task = this.service.create(dto);
      res.status(201).json(task);
    } catch (err) {
      next(err);
    }
  };

  update = (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const dto: UpdateTaskDto = req.body;
      const task = this.service.update(id, dto);
      if (!task) return res.status(404).json({ error: 'Tarefa não encontrada' });
      res.json(task);
    } catch (err) {
      next(err);
    }
  };

  delete = (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const ok = this.service.delete(id);
      if (!ok) return res.status(404).json({ error: 'Tarefa não encontrada' });
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  };
}

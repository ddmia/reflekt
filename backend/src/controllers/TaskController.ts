import { Request, Response, NextFunction } from 'express';
import { TaskService } from '../services/TaskService';
import { CreateTaskDto, UpdateTaskDto } from '../dtos/task.dto';

export class TaskController {
  constructor(private taskService: TaskService) {}

  list = (req: Request, res: Response, next: NextFunction) => {
    try {
      const { status, priority, tag } = req.query;
      const tasks = this.taskService.list({
        status: status as string | undefined,
        priority: priority as string | undefined,
        tag: tag as string | undefined,
      });
      res.json(tasks);
    } catch (err) {
      next(err);
    }
  };

  get = (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const task = this.taskService.get(id);
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
      const task = this.taskService.create(dto);
      res.status(201).json(task);
    } catch (err) {
      next(err);
    }
  };

  update = (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const dto: UpdateTaskDto = req.body;
      const task = this.taskService.update(id, dto);
      if (!task) return res.status(404).json({ error: 'Tarefa não encontrada' });
      res.json(task);
    } catch (err) {
      next(err);
    }
  };

  delete = (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const ok = this.taskService.delete(id);
      if (!ok) return res.status(404).json({ error: 'Tarefa não encontrada' });
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  };
}

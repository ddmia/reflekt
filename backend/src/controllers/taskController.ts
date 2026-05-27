import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { CreateTaskDto, UpdateTaskDto } from '../dtos/input';
import { TaskService } from '../services/taskService';

export function makeTaskController(service: TaskService) {
  return {
    async create(req: Request, res: Response, next: NextFunction) {
      try {
        const parsed = CreateTaskDto.parse(req.body);
        const created = await service.create(parsed as any, parsed.tags);
        res.status(201).json(created);
      } catch (err) { next(err); }
    },

    async list(req: Request, res: Response, next: NextFunction) {
      try {
        const filters: any = {};
        if (req.query.status) filters.status = req.query.status;
        if (req.query.priority) filters.priority = req.query.priority;
        const items = await service.list(filters);
        res.json(items);
      } catch (err) { next(err); }
    },

    async get(req: Request, res: Response, next: NextFunction) {
      try {
        const id = Number(req.params.id);
        const item = await service.get(id);
        res.json(item);
      } catch (err) { next(err); }
    },

    async update(req: Request, res: Response, next: NextFunction) {
      try {
        const id = Number(req.params.id);
        const parsed = UpdateTaskDto.parse(req.body);
        const updated = await service.update(id, parsed as any, (parsed as any).tags);
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

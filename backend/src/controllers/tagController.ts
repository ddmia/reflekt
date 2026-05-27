import { Request, Response, NextFunction } from 'express';
import { CreateTagDto } from '../dtos/input';
import { TagService } from '../services/tagService';

export function makeTagController(service: TagService) {
  return {
    async create(req: Request, res: Response, next: NextFunction) {
      try {
        const parsed = CreateTagDto.parse(req.body);
        const created = await service.create(parsed.name, parsed.color);
        res.status(201).json(created);
      } catch (err) { next(err); }
    },

    async list(req: Request, res: Response, next: NextFunction) {
      try {
        res.json(await service.list());
      } catch (err) { next(err); }
    },

    async attach(req: Request, res: Response, next: NextFunction) {
      try {
        const taskId = Number(req.params.taskId);
        const tagId = Number(req.params.tagId);
        await service.attach(taskId, tagId);
        res.status(204).send();
      } catch (err) { next(err); }
    },

    async detach(req: Request, res: Response, next: NextFunction) {
      try {
        const taskId = Number(req.params.taskId);
        const tagId = Number(req.params.tagId);
        await service.detach(taskId, tagId);
        res.status(204).send();
      } catch (err) { next(err); }
    }
  };
}

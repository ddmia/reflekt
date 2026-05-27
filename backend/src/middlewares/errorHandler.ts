import { Request, Response, NextFunction } from 'express';

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({ message: 'Not Found' });
}

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  if (err?.name === 'ZodError') {
    return res.status(422).json({ message: 'Validation error', issues: err.errors });
  }
  if (err?.message === 'NotFound') return res.status(404).json({ message: 'Resource not found' });
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
}

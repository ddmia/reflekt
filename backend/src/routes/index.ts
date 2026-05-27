import { Router } from 'express';
import { TaskController } from '../controllers/TaskController';
import { NoteController } from '../controllers/NoteController';

export function createRouter(taskController: TaskController, noteController: NoteController) {
  const router = Router();

  // Tasks
  router.get('/tasks', taskController.list);
  router.get('/tasks/:id', taskController.get);
  router.post('/tasks', taskController.create);
  router.put('/tasks/:id', taskController.update);
  router.delete('/tasks/:id', taskController.delete);

  // Notes
  router.get('/tasks/:taskId/notes', noteController.list);
  router.post('/tasks/:taskId/notes', noteController.create);
  router.put('/tasks/:taskId/notes/:id', noteController.update);
  router.delete('/tasks/:taskId/notes/:id', noteController.delete);

  return router;
}

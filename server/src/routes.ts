import { Router } from 'express';
import { listTasks, createTask, getTask, updateTask, deleteTask, addNote } from './controllers/taskController';

const router = Router();

router.get('/tasks', listTasks);
router.post('/tasks', createTask);
router.get('/tasks/:id', getTask);
router.put('/tasks/:id', updateTask);
router.delete('/tasks/:id', deleteTask);
router.post('/tasks/:id/notes', addNote);

export default router;

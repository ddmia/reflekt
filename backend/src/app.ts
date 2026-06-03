import express from 'express';
import path from 'path';
import { InMemoryTaskRepository } from './repositories/TaskRepository';
import { InMemoryNoteRepository } from './repositories/NoteRepository';
import { TaskService } from './services/TaskService';
import { NoteService } from './services/NoteService';
import { TaskController } from './controllers/TaskController';
import { NoteController } from './controllers/NoteController';
import { buildRouter } from './routes';
import { errorHandler } from './middlewares/errorHandler';

const app = express();
app.use(express.json());

// instantiate repositories
const taskRepo = new InMemoryTaskRepository();
const noteRepo = new InMemoryNoteRepository();

// services
const taskService = new TaskService(taskRepo, noteRepo);
const noteService = new NoteService(taskRepo, noteRepo);

// controllers
const taskController = new TaskController(taskService);
const noteController = new NoteController(noteService);

// routes
app.use('/api/v1', buildRouter(taskController, noteController));

// serve frontend
const frontendPath = path.resolve(__dirname, '../../frontend');
app.use(express.static(frontendPath));
app.get('/', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// error handler
app.use(errorHandler);

const PORT = 3001;
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on http://localhost:${PORT}`);
});

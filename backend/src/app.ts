import express from 'express';
import path from 'path';
import { InMemoryTaskRepository } from './repositories/TaskRepository';
import { InMemoryNoteRepository } from './repositories/NoteRepository';
import { TaskService } from './services/TaskService';
import { NoteService } from './services/NoteService';
import { TaskController } from './controllers/TaskController';
import { NoteController } from './controllers/NoteController';
import { createRouter } from './routes/index';
import { errorHandler } from './middlewares/errorHandler';

const app = express();
app.use(express.json());

// instantiate repos
const taskRepo = new InMemoryTaskRepository();
const noteRepo = new InMemoryNoteRepository();

// services
const taskService = new TaskService(taskRepo, noteRepo);
const noteService = new NoteService(taskRepo, noteRepo);

// controllers
const taskController = new TaskController(taskService);
const noteController = new NoteController(noteService);

app.use('/api/v1', createRouter(taskController, noteController));

// Serve frontend
app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../../frontend/index.html'));
});

app.use('/static', express.static(path.resolve(__dirname, '../../frontend')));

// error handler
app.use(errorHandler);

const port = 3001;
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on http://localhost:${port}`);
});

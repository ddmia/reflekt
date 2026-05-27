import { Router } from 'express';
import { SqliteTaskRepository } from '../repositories/sqliteTaskRepository';
import { SqliteNoteRepository } from '../repositories/sqliteNoteRepository';
import { SqliteTagRepository } from '../repositories/sqliteTagRepository';
import { TaskService } from '../services/taskService';
import { NoteService } from '../services/noteService';
import { TagService } from '../services/tagService';
import { makeTaskController } from '../controllers/taskController';
import { makeNoteController } from '../controllers/noteController';
import { makeTagController } from '../controllers/tagController';
import type { DBWrapper } from '../db/index';

export function createRouter(db: DBWrapper) {
	const router = Router();

	const taskRepo = new SqliteTaskRepository(db);
	const noteRepo = new SqliteNoteRepository(db);
	const tagRepo = new SqliteTagRepository(db);

	const taskSvc = new TaskService(taskRepo, tagRepo, noteRepo);
	const noteSvc = new NoteService(noteRepo);
	const tagSvc = new TagService(tagRepo);

	const taskCtrl = makeTaskController(taskSvc);
	const noteCtrl = makeNoteController(noteSvc);
	const tagCtrl = makeTagController(tagSvc);

	// Tasks
	router.post('/tasks', taskCtrl.create);
	router.get('/tasks', taskCtrl.list);
	router.get('/tasks/:id', taskCtrl.get);
	router.put('/tasks/:id', taskCtrl.update);
	router.delete('/tasks/:id', taskCtrl.remove);

	// Notes
	router.post('/notes', noteCtrl.create);
	router.get('/tasks/:taskId/notes', noteCtrl.listByTask);
	router.put('/notes/:id', noteCtrl.update);
	router.delete('/notes/:id', noteCtrl.remove);

	// Tags
	router.post('/tags', tagCtrl.create);
	router.get('/tags', tagCtrl.list);
	router.post('/tasks/:taskId/tags/:tagId', tagCtrl.attach);
	router.delete('/tasks/:taskId/tags/:tagId', tagCtrl.detach);

	return router;
}


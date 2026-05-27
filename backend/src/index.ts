import express from 'express';
import { createRouter } from './routes';
import { notFoundHandler, errorHandler } from './middlewares/errorHandler';
import { createDatabase } from './db';

async function main() {
	const db = await createDatabase();
	const app = express();
	app.use(express.json());

	app.use('/api/v1', createRouter(db));

	app.use(notFoundHandler);
	app.use(errorHandler as any);

	const port = process.env.PORT ? Number(process.env.PORT) : 3001;
	app.listen(port, () => console.log(`Backend listening on http://localhost:${port}`));
}

main().catch(err => { console.error('Failed to start', err); process.exit(1); });

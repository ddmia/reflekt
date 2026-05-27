import initSqlJs, { Database as SqlJsDatabase, SqlJsStatic } from 'sql.js';
import fs from 'fs';
import path from 'path';

const DB_FILE = path.join(__dirname, '..', '..', 'tasks.db');
const SCHEMA = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf-8');

export type DBWrapper = {
	exec: (sql: string) => any;
	prepare: (sql: string) => any;
	run: (sql: string, params?: any[]) => any;
	get: (sql: string, params?: any[]) => any;
	all: (sql: string, params?: any[]) => any[];
	exportToFile: () => void;
	raw: SqlJsDatabase;
};

export async function createDatabase(): Promise<DBWrapper> {
	// Try to locate the wasm file shipped with sql.js inside node_modules.
	const wasmCandidate = path.join(__dirname, '..', '..', 'node_modules', 'sql.js', 'dist', 'sql-wasm.wasm');
	if (!fs.existsSync(wasmCandidate)) {
		throw new Error(`Failed to find sql-wasm.wasm at ${wasmCandidate}. Ensure dependencies are installed.`);
	}
	const SQL = await initSqlJs({ locateFile: () => wasmCandidate });
	let db: SqlJsDatabase;
	if (fs.existsSync(DB_FILE)) {
		const filebuf = fs.readFileSync(DB_FILE);
		db = new SQL.Database(new Uint8Array(filebuf));
	} else {
		db = new SQL.Database();
		db.run('PRAGMA foreign_keys = ON;');
		db.run(SCHEMA);
		fs.writeFileSync(DB_FILE, Buffer.from(db.export()));
	}

	const wrapper: DBWrapper = {
		exec: (sql: string) => db.exec(sql),
		prepare: (sql: string) => {
			const stmt = db.prepare(sql);
			return {
				run: (params?: any[]) => { stmt.bind(params || []); stmt.step(); stmt.free(); },
				get: (params?: any[]) => { stmt.bind(params || []); const row = stmt.getAsObject(); stmt.free(); return row; },
				all: (params?: any[]) => { stmt.bind(params || []); const rows: any[] = []; while (stmt.step()) { rows.push(stmt.getAsObject()); } stmt.free(); return rows; }
			};
		},
		run: (sql: string, params?: any[]) => {
			const stmt = db.prepare(sql);
			stmt.bind(params || []);
			stmt.step();
			stmt.free();
			// return changes or last insert id via query
			const res = db.exec('SELECT last_insert_rowid() as id');
			const id = res && res[0] && res[0].values && res[0].values[0] ? res[0].values[0][0] : null;
			return { lastInsertRowid: id };
		},
		get: (sql: string, params?: any[]) => {
			const stmt = db.prepare(sql);
			stmt.bind(params || []);
			const row = stmt.step() ? stmt.getAsObject() : null;
			stmt.free();
			return row;
		},
		all: (sql: string, params?: any[]) => {
			const stmt = db.prepare(sql);
			stmt.bind(params || []);
			const rows: any[] = [];
			while (stmt.step()) rows.push(stmt.getAsObject());
			stmt.free();
			return rows;
		},
		exportToFile: () => {
			fs.writeFileSync(DB_FILE, Buffer.from(db.export()));
		},
		raw: db
	};

	return wrapper;
}


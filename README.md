# Reflekt — Tasks (monorepo)

Monorepo with `backend` (Express + SQLite) and `frontend` (Vite + React).

Quick start:

Backend:

```powershell
cd backend
npm install
npm run dev
```

Frontend:

```powershell
cd frontend
npm install
npm run dev
```

API base: `http://localhost:3001/api/v1`
Task Manager (TypeScript)

This workspace contains a minimal TypeScript task manager split into `server` (Express API) and `client` (React + Vite).

Run server:

```bash
cd server
npm install
npm run dev
```

Run client:

```bash
cd client
npm install
npm run dev
```

API base: `http://localhost:4000/api`

Key files:

- Server: [server/src/index.ts](server/src/index.ts)
- Server DTOs: [server/src/dtos/taskDTO.ts](server/src/dtos/taskDTO.ts)
- Server repo: [server/src/repositories/taskRepository.ts](server/src/repositories/taskRepository.ts)
- Client: [client/src/App.tsx](client/src/App.tsx)

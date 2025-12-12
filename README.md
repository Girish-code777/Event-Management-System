# College Event Management System

Monorepo skeleton focusing initially on the backend (Node.js + Express + TypeScript + MongoDB). Frontend will be added next.

## Prerequisites
- Node.js 18+
- npm or pnpm or yarn
- Docker (optional, for MongoDB)

## Quick start (Backend)
1. Copy env
```
cp server/.env.example server/.env
```
2. Start MongoDB (Docker) or use your own connection string
```
docker compose up -d mongo
```
3. Install and run
```
cd server
npm install
npm run dev
```
Server runs at http://localhost:4000

## API (MVP)
- POST /auth/signup
- POST /auth/login
- GET /events
- POST /events (admin/coordinator)
- PATCH /events/:id (admin/coordinator)
- DELETE /events/:id (admin/coordinator)

## Next
- Frontend (React + Vite + Tailwind + shadcn/ui)
- Registrations, Feedback, Dashboards, Notifications

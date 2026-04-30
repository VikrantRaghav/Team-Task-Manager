# Team Task Manager

Role-based full-stack MERN app for managing projects and tasks.

## Features

- JWT authentication with role-based access (`admin` and `member`)
- Project CRUD (admin) with member management
- Task CRUD (admin) with task assignment
- Member-only task status updates for assigned tasks
- Dashboard analytics with overdue highlighting and recent tasks
- Task filtering by status, project, and assignee
- Toast notifications, loading states, and empty states
- Searchable user dropdowns (name/email) instead of manual ID entry
- Responsive UI built with Tailwind CSS

## Demo Credentials

- Admin: `admin@test.com` / `123456`
- Member: `member@test.com` / `123456`

## Screenshots

- `[Add Dashboard Screenshot Here]`
- `[Add Projects Screenshot Here]`
- `[Add Tasks Screenshot Here]`

## Tech Stack

- Frontend: React + Vite + JavaScript + Tailwind CSS
- Backend: Node.js + Express.js
- Database: MongoDB + Mongoose
- Authentication: JWT + bcrypt

## Setup Steps (Local)

### 1) Clone and install dependencies

```bash
cd backend
npm install

cd ../frontend
npm install
```

### 2) Configure environment files

Backend:

```bash
cd backend
cp .env.example .env
```

Frontend:

```bash
cd frontend
cp .env.example .env
```

### 3) Start backend and frontend

Backend:

```bash
cd backend
npm run dev
```

Frontend:

```bash
cd frontend
npm run dev
```

### 4) Seed demo data (optional but recommended)

```bash
cd backend
npm run seed
```

## API Overview

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/auth/users` (admin only, for searchable user lists)
- `GET/POST /api/projects`
- `GET/PUT/DELETE /api/projects/:id`
- `PATCH /api/projects/:id/add-member`
- `PATCH /api/projects/:id/remove-member`
- `GET/POST /api/tasks`
- `PUT/DELETE /api/tasks/:id`
- `GET /api/dashboard`

## Railway Deployment (Ready)

Deploy backend and frontend as two services:

### Backend Service

- Root directory: `backend`
- Start command: `npm start`
- Required envs:
  - `PORT`
  - `MONGO_URI`
  - `JWT_SECRET`
  - `JWT_EXPIRES_IN`
  - `CLIENT_URL` (frontend domain)

### Frontend Service

- Root directory: `frontend`
- Build command: `npm run build`
- Start command: `npm run preview -- --host 0.0.0.0 --port $PORT`
- Required env:
  - `VITE_API_URL` = backend URL + `/api`

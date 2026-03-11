# English Learning Platform

A full-stack English vocabulary learning website inspired by **VocaPrep**.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Go 1.22, Gin, GORM, PostgreSQL |
| Frontend | React 18, Vite, React Router, Axios |
| Database | PostgreSQL 16 |
| Infrastructure | Docker, Docker Compose, Nginx |

## Quick Start

```bash
# 1. Clone & enter the project
cd learn-english

# 2. Copy environment variables
cp .env.example .env

# 3. Build & start all services
docker compose up --build

# Services will be available at:
# Frontend  →  http://localhost:3000
# Backend   →  http://localhost:8080
# Database  →  localhost:5432
```

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/health` | — | Health check |
| POST | `/api/auth/register` | — | Register user |
| POST | `/api/auth/login` | — | Login, get JWT |
| GET | `/api/auth/me` | ✅ | Current user |
| GET | `/api/courses` | — | List vocabulary sets |
| GET | `/api/courses/:id` | — | Course detail |
| GET | `/api/lessons/:id` | — | Lesson + vocabulary |
| GET | `/api/lessons/course/:courseId` | — | Lessons by course |
| GET | `/api/topics` | — | List topics |
| GET | `/api/topics/:id` | — | Topic detail |
| GET | `/api/progress` | ✅ | My learning progress |
| POST | `/api/progress` | ✅ | Update progress |

## Development (without Docker)

**Backend:**
```bash
cd backend
cp ../.env.example .env   # adjust DB_HOST=localhost
go run ./cmd/server
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
# Open http://localhost:5173
```

## Project Structure

```
learn-english/
├── backend/
│   ├── cmd/server/main.go          # Entry point
│   ├── internal/
│   │   ├── config/                 # Env config
│   │   ├── models/                 # GORM models
│   │   ├── handlers/               # HTTP handlers
│   │   ├── middleware/             # JWT auth
│   │   └── database/               # Postgres + seed
│   ├── Dockerfile
│   └── go.mod
├── frontend/
│   ├── src/
│   │   ├── api/                    # Axios client
│   │   ├── context/                # Auth context
│   │   ├── components/             # Reusable UI
│   │   └── pages/                  # Route pages
│   ├── nginx.conf
│   └── Dockerfile
├── docker-compose.yml
└── .env.example
```
# learning-english

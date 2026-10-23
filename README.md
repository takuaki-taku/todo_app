# Todo App

A simple Todo app built for learning purposes, using a React + TypeScript (Vite) frontend and a FastAPI backend.

## Project structure

```
todo_app/
├── backend/     # FastAPI + SQLAlchemy + MySQL
│   ├── main.py        # API endpoints
│   ├── database.py    # Database connection (reads DATABASE_URL from the environment)
│   ├── models.py      # tasks table definition
│   └── requirements.txt
├── frontend/    # React + TypeScript (Vite)
└── .env.example # Sample environment variables
```

## Features

- Add tasks, list tasks, toggle completion, delete tasks (CRUD)

## Getting started

### Prerequisites

- Python 3.8 or later
- Node.js
- MySQL (create the `todo_app` database first)

```sql
CREATE DATABASE todo_app;
```

### 1. Set up environment variables

```bash
cp .env.example .env
# Edit .env with your own MySQL connection details
```

### 2. Start the backend (http://localhost:8000)

```bash
pip install -r backend/requirements.txt
uvicorn backend.main:app --reload --env-file .env
```

### 3. Start the frontend (http://localhost:5173)

```bash
cd frontend
npm install
npm run dev
```

## API endpoints

| Method | Path | Description |
| --- | --- | --- |
| GET | `/tasks` | List tasks |
| POST | `/tasks` | Create a task |
| PUT | `/tasks/{task_id}` | Update a task (toggle completion, etc.) |
| DELETE | `/tasks/{task_id}` | Delete a task |

Swagger UI: http://localhost:8000/docs

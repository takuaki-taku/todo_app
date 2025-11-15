# Todo App

A full-stack todo application built with React/TypeScript (frontend) and Python/FastAPI (backend).

## Overview

This is a modern todo application that allows users to create, update, and delete tasks. The application features a clean and intuitive user interface with a robust backend API.

## Tech Stack

- **Frontend:**
  - React
  - TypeScript
  - Modern CSS

- **Backend:**
  - Python
  - FastAPI
  - MySQL

## Features

- Create, read, update, and delete todos
- User authentication
- Responsive design
- RESTful API

## Setup

### Prerequisites

- Node.js (v14 or higher)
- Python 3.8 or higher
- MySQL

### Backend Setup

```bash
# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your database credentials

# Run migrations
alembic upgrade head

# Start the server
uvicorn main:app --reload
```

### Frontend Setup

```bash
# Install dependencies
npm install

# Start the development server
npm start
```

## Usage

1. Start the backend server (default: http://localhost:8000)
2. Start the frontend development server (default: http://localhost:3000)
3. Open your browser and navigate to http://localhost:3000

## API Endpoints

- `GET /todos` - Get all todos
- `POST /todos` - Create a new todo
- `PUT /todos/{id}` - Update a todo
- `DELETE /todos/{id}` - Delete a todo

## License

MIT License

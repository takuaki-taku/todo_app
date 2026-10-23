from typing import List, Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from .database import database, engine, metadata
from .models import tasks

# アプリケーション作成
app = FastAPI(title="Todo App API")

# データベース初期化
metadata.create_all(engine)

# CORSの設定（開発用フロントエンドのオリジンのみ許可）
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Vite 既定ポート
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Pydanticモデル
class Task(BaseModel):
    id: int
    task: str
    completed: bool


class TaskCreate(BaseModel):
    task: str


class TaskUpdate(BaseModel):
    task: Optional[str] = None
    completed: Optional[bool] = None


@app.get("/")
def read_root():
    return {"message": "Todo App API"}


# タスク一覧を取得
@app.get("/tasks", response_model=List[Task])
async def get_tasks():
    query = tasks.select()
    return await database.fetch_all(query)


# タスクを追加
@app.post("/tasks", response_model=Task)
async def create_task(task: TaskCreate):
    query = tasks.insert().values(task=task.task, completed=False)
    last_record_id = await database.execute(query)
    return {"id": last_record_id, "task": task.task, "completed": False}


# タスクを更新（完了フラグの切り替え・内容の変更）
@app.put("/tasks/{task_id}", response_model=Task)
async def update_task(task_id: int, task: TaskUpdate):
    values = {k: v for k, v in task.model_dump().items() if v is not None}
    if not values:
        raise HTTPException(status_code=400, detail="No fields to update")

    query = tasks.update().where(tasks.c.id == task_id).values(**values)
    await database.execute(query)

    row = await database.fetch_one(tasks.select().where(tasks.c.id == task_id))
    if row is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return dict(row)


# タスクを削除
@app.delete("/tasks/{task_id}", status_code=204)
async def delete_task(task_id: int):
    query = tasks.delete().where(tasks.c.id == task_id)
    result = await database.execute(query)
    if not result:
        raise HTTPException(status_code=404, detail="Task not found")
    return


# アプリケーション起動前後の処理
@app.on_event("startup")
async def startup():
    await database.connect()


@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()

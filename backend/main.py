from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from .database import database, metadata, engine
from .models import tasks

# アプリケーション作成
app = FastAPI()

# データベース初期化
metadata.create_all(engine)


# Pydanticモデル
class Task(BaseModel):
    id: int
    task: str
    completed: bool


class TaskCreate(BaseModel):
    task: str


# CORSの設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # どのオリジンからでもアクセスを許可
    allow_credentials=True,
    allow_methods=["*"],  # すべてのHTTPメソッドを許可
    allow_headers=["*"],  # すべてのヘッダーを許可
)


# 例としてのエンドポイント
@app.get("/")
def read_root():
    return {"message": "Hello, world!"}


# タスクを取得
@app.get("/tasks", response_model=List[Task])
async def get_tasks():
    query = tasks.select()
    return await database.fetch_all(query)


# タスクを追加
@app.post("/tasks", response_model=Task)
async def create_task(task: TaskCreate):
    query = tasks.insert().values(task=task.task, completed=False)
    last_record_id = await database.execute(query)
    return {**task.dict(), "id": last_record_id, "completed": False}


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

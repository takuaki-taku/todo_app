# Todo App

React + TypeScript (Vite) のフロントエンドと FastAPI のバックエンドで構築した、学習用のシンプルな Todo アプリです。

## 構成

```
todo_app/
├── backend/     # FastAPI + SQLAlchemy + MySQL
│   ├── main.py        # APIエンドポイント
│   ├── database.py    # DB接続（.env の DATABASE_URL を使用）
│   ├── models.py      # tasks テーブル定義
│   └── requirements.txt
├── frontend/    # React + TypeScript (Vite)
└── .env.example # 環境変数のサンプル
```

## 機能

- タスクの追加 / 一覧表示 / 完了切り替え / 削除（CRUD）

## セットアップ

### 事前に必要なもの

- Python 3.8 以上
- Node.js
- MySQL（`todo_app` データベースを作成しておくこと）

```sql
CREATE DATABASE todo_app;
```

### 1. 環境変数の設定

```bash
cp .env.example .env
# .env を編集して自分の MySQL 接続情報を設定
```

### 2. バックエンドの起動（http://localhost:8000）

```bash
pip install -r backend/requirements.txt
uvicorn backend.main:app --reload --env-file .env
```

### 3. フロントエンドの起動（http://localhost:5173）

```bash
cd frontend
npm install
npm run dev
```

## API エンドポイント

| メソッド | パス | 内容 |
| --- | --- | --- |
| GET | `/tasks` | タスク一覧取得 |
| POST | `/tasks` | タスク追加 |
| PUT | `/tasks/{task_id}` | タスク更新（完了切り替えなど） |
| DELETE | `/tasks/{task_id}` | タスク削除 |

Swagger UI: http://localhost:8000/docs

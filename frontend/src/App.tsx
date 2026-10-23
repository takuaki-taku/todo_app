import React, { useEffect, useState } from "react";

// Define the task type
type Task = {
  id: number;
  task: string;
  completed: boolean;
};

const API_URL = "http://localhost:8000";

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(`${API_URL}/tasks`);
        if (!response.ok) {
          throw new Error("Failed to fetch tasks");
        }
        const data: Task[] = await response.json();
        setTasks(data);
      } catch (e) {
        console.error(e);
        setError("タスクの取得に失敗しました。バックエンドが起動しているか確認してください。");
      }
    };
    fetchTasks();
  }, []);

  const addTask = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    try {
      const response = await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task: trimmed }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to add task");
      }
      const newTask: Task = await response.json();
      setTasks([...tasks, newTask]);
      setInput("");
      setError(null);
    } catch (e: unknown) {
      if (e instanceof Error) {
        console.error("Error adding task:", e.message);
        setError(e.message);
      } else {
        console.error("An unexpected error occurred:", e);
      }
    }
  };

  const toggleTask = async (id: number, completed: boolean) => {
    try {
      const response = await fetch(`${API_URL}/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !completed }),
      });
      if (!response.ok) {
        throw new Error("Failed to update task");
      }
      setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !completed } : task)));
      setError(null);
    } catch (e) {
      console.error(e);
      setError("タスクの更新に失敗しました。");
    }
  };

  const deleteTask = async (id: number) => {
    try {
      const response = await fetch(`${API_URL}/tasks/${id}`, { method: "DELETE" });
      if (!response.ok) {
        throw new Error("Failed to delete task");
      }
      setTasks(tasks.filter((task) => task.id !== id));
      setError(null);
    } catch (e) {
      console.error(e);
      setError("タスクの削除に失敗しました。");
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", fontFamily: "Arial, sans-serif" }}>
      <h1>Todo List</h1>

      <div style={{ display: "flex", gap: 10 }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") addTask();
          }}
          placeholder="タスクを入力"
          style={{ flex: 1, padding: 10, fontSize: 16 }}
        />
        <button onClick={addTask} style={{ padding: "10px 20px", fontSize: 16 }}>
          追加
        </button>
      </div>

      {error && <p style={{ color: "crimson" }}>{error}</p>}

      <ul style={{ listStyle: "none", padding: 0 }}>
        {tasks.map((task) => (
          <li key={task.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0" }}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleTask(task.id, task.completed)}
            />
            <span
              style={{
                flex: 1,
                textDecoration: task.completed ? "line-through" : "none",
                color: task.completed ? "#999" : "inherit",
              }}
            >
              {task.task}
            </span>
            <button onClick={() => deleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;

import React, { useEffect, useState } from "react";

// タスクの型を定義
type Task = {
  id: number;
  task: string;
};

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState<string>('');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch("http://localhost:8000/tasks");
        if (!response.ok) {
          throw new Error("Failed to fetch tasks");
        }
        const data: Task[] = await response.json();
        setTasks(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchTasks();
  }, []);

  const addTask = async () => {
    try {
      const response = await fetch("http://localhost:8000/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task: input }), // input state を使う
      });
      if (!response.ok) {
        const errorData = await response.json(); // エラーの詳細を取得
        const errorMessage = errorData.message || "Failed to add task"; // エラーメッセージをカスタマイズ
        throw new Error(errorMessage);
      }
      const newTask: Task = await response.json();
      setTasks([...tasks, newTask]);
    } catch (error: unknown) {
      // エラーハンドリングを改善
      if (error instanceof Error) {
        console.error("Error adding task:", error.message);
        // エラーメッセージをユーザーに表示する処理を追加
      } else {
        console.error("An unexpected error occurred:", error);
      }
    }
  };

  const deleteTask = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8000/tasks/${id}`, { method: "DELETE" });
      if (!response.ok) {
        throw new Error("Failed to delete task");
      }
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Todo List</h1>
      <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="タスクを入力"
          style={{ padding: '10px', fontSize: '16px' }}
        />
       <button onClick={addTask} style={{ padding: '10px', marginLeft: '10px' }}>
          追加
        </button>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            {task.task}
            <button onClick={() => deleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <button onClick={() => addTask("New Task")}>Add Task</button>
    </div>
  );
};

export default App;

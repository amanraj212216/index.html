import { useEffect, useState } from "react";

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    fetch("http://localhost:4000/tasks")
      .then(res => res.json())
      .then(setTasks);
  }, []);

  const addTask = async () => {
    if (!title.trim()) return;
    const res = await fetch("http://localhost:4000/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    const newTask = await res.json();
    setTasks([newTask, ...tasks]);
    setTitle("");
  };

  const toggleTask = async (id) => {
    const res = await fetch(`http://localhost:4000/tasks/${id}/toggle`, { method: "PATCH" });
    const updated = await res.json();
    setTasks(tasks.map(t => (t.id === id ? updated : t)));
  };

  const deleteTask = async (id) => {
    await fetch(`http://localhost:4000/tasks/${id}`, { method: "DELETE" });
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <div style={{ maxWidth: 400, margin: "50px auto", fontFamily: "Arial" }}>
      <h1>Task Manager</h1>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter task"
      />
      <button onClick={addTask}>Add</button>
      <ul>
        {tasks.map((t) => (
          <li key={t.id}>
            <span
              onClick={() => toggleTask(t.id)}
              style={{
                textDecoration: t.done ? "line-through" : "none",
                cursor: "pointer",
              }}
            >
              {t.title}
            </span>
            <button onClick={() => deleteTask(t.id)}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  );
      }

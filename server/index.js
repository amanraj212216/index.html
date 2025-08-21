
const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const { randomUUID } = require("crypto");

const app = express();
const PORT = process.env.PORT || 4000;
const DB_PATH = path.join(__dirname, "tasks.json");

app.use(cors());
app.use(express.json());

// Helper functions
function readTasks() {
  if (!fs.existsSync(DB_PATH)) fs.writeFileSync(DB_PATH, JSON.stringify([]));
  return JSON.parse(fs.readFileSync(DB_PATH, "utf8"));
}
function writeTasks(tasks) {
  fs.writeFileSync(DB_PATH, JSON.stringify(tasks, null, 2));
}

// Routes
app.get("/", (_req, res) => res.json({ ok: true, service: "task-manager-api" }));

app.get("/tasks", (_req, res) => {
  res.json(readTasks());
});

app.post("/tasks", (req, res) => {
  const { title } = req.body || {};
  if (!title || !title.trim()) return res.status(400).json({ error: "Title required" });
  const tasks = readTasks();
  const newTask = { id: randomUUID(), title: title.trim(), done: false };
  tasks.unshift(newTask);
  writeTasks(tasks);
  res.status(201).json(newTask);
});

app.patch("/tasks/:id/toggle", (req, res) => {
  const { id } = req.params;
  const tasks = readTasks();
  const idx = tasks.findIndex(t => t.id === id);
  if (idx === -1) return res.status(404).json({ error: "Not found" });
  tasks[idx].done = !tasks[idx].done;
  writeTasks(tasks);
  res.json(tasks[idx]);
});

app.delete("/tasks/:id", (req, res) => {
  const { id } = req.params;
  const tasks = readTasks();
  const updated = tasks.filter(t => t.id !== id);
  if (updated.length === tasks.length) return res.status(404).json({ error: "Not found" });
  writeTasks(updated);
  res.status(204).end();
});

app.listen(PORT, () => console.log(`✅ API running on http://localhost:${PORT}`));




import { Task, TaskPayload, GetTasksParams } from "../types/task";

const API_URL = 'https://todolist-for-automaze.onrender.com';

export async function getTasks(params: GetTasksParams = {}) {
  const query = new URLSearchParams(params as Record<string,string>);
  const res = await fetch(`${API_URL}/tasks?${query.toString()}`);
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  return res.json() as Promise<Task[]>;
}

export async function addTask(task: TaskPayload) {
  const res = await fetch(`${API_URL}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  return res.json() as Promise<Task>;
}

export async function updateTask(id: number, task: Partial<TaskPayload>) {
  const res = await fetch(`${API_URL}/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  });
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  return res.json() as Promise<Task>;
}

export async function deleteTask(id: number) {
  const res = await fetch(`${API_URL}/tasks/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  return res.json();
}

export async function reorderTasks(ids: number[]) {
  const res = await fetch(`${API_URL}/tasks/reorder`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ids }),
  });
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  return res.json() as Promise<Task[]>;
}


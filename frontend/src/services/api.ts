const API_URL = 'http://localhost:8080';

export interface GetTasksParams {
  search?: string;
  status?: "done" | "undone";
  sort?: "asc" | "desc";
}

export interface TaskPayload {
  title: string;
  priority: number;
  category?: string; 
  due_date?: string | null;
  done?: boolean;
}

export async function getTasks(params: GetTasksParams = {}) {
  const query = new URLSearchParams(params as Record<string,string>);
  const res = await fetch(`${API_URL}/tasks?${query.toString()}`);
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  return res.json();
}

export async function addTask(task: TaskPayload) {
  const res = await fetch(`${API_URL}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  return res.json();
}

export async function updateTask(id: number, task: Partial<TaskPayload>) {
  const res = await fetch(`${API_URL}/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  });
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  return res.json();
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
  return res.json();
}

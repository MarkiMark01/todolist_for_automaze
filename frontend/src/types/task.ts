export interface Task {
  id: number;
  title: string;
  done: boolean;
  priority: number;
  category?: string | null;
  due_date?: string | null;
}

export interface TaskPayload {
  title: string;
  priority: number;
  category?: string;
  due_date?: string | null;
}

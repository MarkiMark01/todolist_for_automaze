import HomeClient from "../components/HomeClient";
import { getTasks } from "../services/api";
import { Task } from "../types/task";

export default async function Page() {
  let initialTasks: Task[] = [];
  try {
    initialTasks = await getTasks({});
  } catch (err) {
    console.error("Failed to fetch tasks for SSR:", err);
  }

  return <HomeClient initialTasks={initialTasks} />;
}


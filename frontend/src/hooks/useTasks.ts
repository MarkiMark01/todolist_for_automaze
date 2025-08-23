"use client";
import { useState, useEffect } from "react";
import { getTasks, addTask, updateTask, deleteTask, reorderTasks } from "../services/api";
import { Task, TaskPayload } from "../types/task";
import { reorderTasksArray } from "../utils/reorder";

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "done" | "undone">("all");
  const [sort, setSort] = useState<"manual" | "asc" | "desc">("manual");

  const fetchTasks = async () => {
    const data = await getTasks({
      search,
      status: statusFilter !== "all" ? statusFilter : undefined,
      sort: sort !== "manual" ? sort : undefined, 
    });
    setTasks(data);
  };

  useEffect(() => {
    fetchTasks();
  }, [search, statusFilter, sort]);

  const handleAdd = async (task: TaskPayload) => {
    await addTask(task);
    fetchTasks();
  };

  const handleToggle = async (id: number) => {
    setTasks(prev =>
      prev.map(t => (t.id === id ? { ...t, done: !t.done } : t))
    );
    const task = tasks.find(t => t.id === id);
    if (task) await updateTask(task.id, { done: !task.done });
  };

  const handleDelete = async (id: number) => {
    await deleteTask(id);
    fetchTasks();
  };

  const handleReorder = async (oldIndex: number, newIndex: number) => {
    const newTasks = reorderTasksArray(tasks, oldIndex, newIndex);
    setTasks(newTasks);

    try {
      await reorderTasks(newTasks.map(t => t.id));
    } catch (err) {
      console.error("Failed to reorder tasks:", err);
      fetchTasks();
    }
  };

  return {
    tasks,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    sort,
    setSort,
    handleAdd,
    handleToggle,
    handleDelete,
    handleReorder,
  };
};

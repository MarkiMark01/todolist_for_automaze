"use client";

import { Box, Input, Select, IconButton, useToast, useColorMode } from "@chakra-ui/react";
import { SunIcon, MoonIcon } from "@chakra-ui/icons";
import { TaskItem } from "./TaskItem";
import { TaskForm } from "./TaskForm";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Task, TaskPayload } from "../types/task";
import { reorderTasksArray } from "../utils/reorder";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useState, useEffect } from "react";
import { getTasks, addTask, updateTask, deleteTask, reorderTasks } from "../services/api";

interface Props {
  initialTasks: Task[];
}

export default function HomeClient({ initialTasks }: Props) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "done" | "undone">("all");
  const [sort, setSort] = useState<"manual" | "asc" | "desc">("manual");

  const toast = useToast();
  const { colorMode, toggleColorMode } = useColorMode();
  const sensors = useSensors(useSensor(PointerSensor));

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
    if (task.priority < 1) task.priority = 1;
    if (task.priority > 10) task.priority = 10;

    await addTask(task);
    fetchTasks();
    toast({ title: "Task added", status: "success", duration: 2000, isClosable: true });
  };

  const handleToggle = async (id: number) => {
    setTasks(prev => prev.map(t => (t.id === id ? { ...t, done: !t.done } : t)));
    const task = tasks.find(t => t.id === id);
    if (task) await updateTask(task.id, { done: !task.done });
  };

  const handleDelete = async (id: number) => {
    await deleteTask(id);
    fetchTasks();
    toast({ title: "Task deleted", status: "error", duration: 2000, isClosable: true });
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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = tasks.findIndex(t => t.id === active.id);
    const newIndex = tasks.findIndex(t => t.id === over.id);
    handleReorder(oldIndex, newIndex);
  };

  return (
    <Box display="flex" flexDirection="column" minH="100vh">
      <Header />
      <Box w="100%" maxW="6xl" mx="auto" p={4} display="flex" justifyContent="flex-end">
        <IconButton
          aria-label="Toggle theme"
          icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
          onClick={toggleColorMode}
        />
      </Box>
      <Box flex="1" maxW="xl" mx="auto" p={8} pt={2}>
        <Input placeholder="Search tasks" value={search} onChange={e => setSearch(e.target.value)} mb={2} />
        <Select value={statusFilter} onChange={e => setStatusFilter(e.target.value as any)} mb={2}>
          <option value="all">All</option>
          <option value="done">Done</option>
          <option value="undone">Undone</option>
        </Select>
        <Select value={sort} onChange={e => setSort(e.target.value as any)} mb={4}>
          <option value="manual">Manual order</option>
          <option value="asc">Priority ↑</option>
          <option value="desc">Priority ↓</option>
        </Select>
        <TaskForm onAdd={handleAdd} />
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
            <ul>
              {tasks.map(task => (
                <TaskItem key={task.id} {...task} onToggle={handleToggle} onDelete={() => handleDelete(task.id)} />
              ))}
            </ul>
          </SortableContext>
        </DndContext>
      </Box>
      <Footer />
    </Box>
  );
}

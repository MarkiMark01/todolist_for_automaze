"use client";

import { Box, Input, Select, IconButton, useToast, useColorMode } from "@chakra-ui/react";
import { SunIcon, MoonIcon } from "@chakra-ui/icons";
import { TaskItem } from "../components/TaskItem";
import { TaskForm } from "../components/TaskForm";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { useTasks } from "../hooks/useTasks";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

export default function Home() {
  const {
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
  } = useTasks();

  const toast = useToast();
  const { colorMode, toggleColorMode } = useColorMode();

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = tasks.findIndex(t => t.id === active.id);
    const newIndex = tasks.findIndex(t => t.id === over.id);
    handleReorder(oldIndex, newIndex);
  };

  const handleAddWithToast = async (taskData: any) => {
    await handleAdd(taskData);
    toast({
      title: "Task added",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  const handleDeleteWithToast = async (id: number) => {
    await handleDelete(id);
    toast({
      title: "Task deleted",
      status: "error",
      duration: 2000,
      isClosable: true,
    });
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
        <Input
          placeholder="Search tasks"
          value={search}
          onChange={e => setSearch(e.target.value)}
          mb={2}
        />

        <Select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value as any)}
          mb={2}
        >
          <option value="all">All</option>
          <option value="done">Done</option>
          <option value="undone">Undone</option>
        </Select>

        <Select
          value={sort}
          onChange={e => setSort(e.target.value as any)}
          mb={4}
        >
          <option value="manual">Manual order</option>
          <option value="asc">Priority ↑</option>
          <option value="desc">Priority ↓</option>
        </Select>

        <TaskForm onAdd={handleAddWithToast} />

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
            <ul>
              {tasks.map(task => (
                <TaskItem
                  key={task.id}
                  {...task}
                  onToggle={handleToggle}
                  onDelete={() => handleDeleteWithToast(task.id)}
                />
              ))}
            </ul>
          </SortableContext>
        </DndContext>
      </Box>
      <Footer />
    </Box>
  );
}

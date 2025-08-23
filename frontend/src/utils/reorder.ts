import { arrayMove } from "@dnd-kit/sortable";
import { Task } from "../types/task";

export const reorderTasksArray = (tasks: Task[], oldIndex: number, newIndex: number): Task[] => {
  return arrayMove(tasks, oldIndex, newIndex);
};

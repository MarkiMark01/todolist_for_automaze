"use client";
import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task } from "../types/task";
import { Box } from "@chakra-ui/react";

interface TaskItemProps extends Task {
  onToggle: (id: number) => void;
  onDelete: () => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  id,
  title,
  done,
  priority,
  category,
  due_date,
  onToggle,
  onDelete,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: done ? 0.5 : 1,
  };

  const displayDate = due_date ? due_date.split("T")[0] : null;

  const getPriorityColor = (prio: number) => {
    if (prio >= 8) return "red.500";
    if (prio >= 4) return "yellow.500";
    return "green.500";
  };

  const isOverdue = displayDate
    ? new Date(displayDate) < new Date() && !done
    : false;

  return (
    <Box
      ref={setNodeRef}
      style={style}
      className="flex justify-between items-center gap-4 p-2 border-b border-gray-200"
      transition="opacity 0.3s"
    >
      <div
        {...listeners}
        {...attributes}
        className="cursor-grab px-2 py-1 bg-gray-100 rounded"
      >
        ⠿
      </div>

      <div className="flex items-center gap-2 flex-wrap flex-1">
        <input type="checkbox" checked={done} onChange={() => onToggle(id)} />

        <span
          style={{
            textDecoration: done ? "line-through" : "none",
            color: isOverdue ? "red" : undefined,
          }}
        >
          {title}
        </span>

        {category && (
          <span className="text-sm text-gray-500">[{category}]</span>
        )}
        <span className="text-sm" style={{ color: getPriorityColor(priority) }}>
          Priority: {priority}
        </span>
        {displayDate && (
          <span
            className="text-sm"
            style={{ color: isOverdue ? "red" : undefined }}
          >
            Date: {displayDate}
          </span>
        )}
      </div>

      <button className="text-red-500 hover:text-red-700" onClick={onDelete}>
        Delete
      </button>
    </Box>
  );
};

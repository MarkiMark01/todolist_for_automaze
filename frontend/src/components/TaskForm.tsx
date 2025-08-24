"use client";
import { useState } from "react";
import { Input, Button, Box } from "@chakra-ui/react";
import { TaskPayload } from "../types/task";

interface Props {
  onAdd: (task: TaskPayload) => void;
}

export const TaskForm: React.FC<Props> = ({ onAdd }) => {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState(1);
  const [category, setCategory] = useState("");
  const [dueDate, setDueDate] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!title) return;
    onAdd({ title, priority, category, due_date: dueDate });
    setTitle("");
    setPriority(1);
    setCategory("");
    setDueDate(null);
  };

  return (
    <Box display="flex" gap={2} mb={4} flexWrap="wrap">
      <Input
        type="text"
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        w="385px"
      />
      <Input
        type="number"
        min={1}
        max={10}
        value={priority}
        onChange={(e) => {
          let value = Number(e.target.value);

          if (value < 1) value = 1;
          if (value > 10) value = 10;

          setPriority(value);
        }}
        w="55px"
      />

      <Input
        type="date"
        value={dueDate ?? ""}
        onChange={(e) => setDueDate(e.target.value)}
        w="55px"
      />
      <Input
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        flex="1"
        minW="440px"
      />

      <Button colorScheme="blue" onClick={handleSubmit}>
        Add
      </Button>
    </Box>
  );
};

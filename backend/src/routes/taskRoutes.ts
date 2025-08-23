import { Router } from "express";
import { getTasks, createTask, reorderTasks, updateTask, deleteTask } from "../controllers/taskController";

const router = Router();

router.get("/", getTasks);
router.post("/", createTask);
router.put("/reorder", reorderTasks);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

export default router;

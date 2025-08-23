import { Request, Response } from "express";
import { query } from "../db";

export const getTasks = async (req: Request, res: Response) => {
  try {
    const search = typeof req.query.search === "string" ? req.query.search : "";
    const status = typeof req.query.status === "string" ? req.query.status : "";
    const sort = typeof req.query.sort === "string" ? req.query.sort : "";

    let sql = "SELECT * FROM tasks WHERE 1=1";
    const params: any[] = [];

    if (search) {
      params.push(`%${search}%`);
      sql += ` AND title ILIKE $${params.length}`;
    }

    if (status === "done") sql += " AND done = true";
    if (status === "undone") sql += " AND done = false";

    if (sort === "asc") sql += " ORDER BY priority ASC";
    else if (sort === "desc") sql += " ORDER BY priority DESC";
    else sql += " ORDER BY position";

    const result = await query(sql, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
};

export const createTask = async (req: Request, res: Response) => {
  try {
    const { title, priority, due_date, category } = req.body;
    if (!title) return res.status(400).json({ error: "Title is required" });

    const { rows } = await query("SELECT COALESCE(MAX(position),0) AS maxPos FROM tasks");
    const maxPos = rows[0].maxpos;

    const prio = Math.max(1, Math.min(10, priority || 1));

    const sql = `
      INSERT INTO tasks (title, priority, done, due_date, category, position)
      VALUES ($1, $2, false, $3, $4, $5)
      RETURNING *
    `;
    const params = [title, prio, due_date || null, category || null, maxPos + 1];
    const result = await query(sql, params);

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to create task" });
  }
};

export const reorderTasks = async (req: Request, res: Response) => {
  try {
    const { ids }: { ids: (string | number)[] } = req.body;
    const numericIds = ids.map(id => Number(id));

    for (let i = 0; i < numericIds.length; i++) {
      await query("UPDATE tasks SET position=$1 WHERE id=$2", [i, numericIds[i]]);
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to reorder tasks" });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { done } = req.body;

    const result = await query(
      "UPDATE tasks SET done=$1 WHERE id=$2 RETURNING *",
      [done, id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to update task" });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await query("DELETE FROM tasks WHERE id=$1", [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete task" });
  }
};


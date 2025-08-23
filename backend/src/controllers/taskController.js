"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.updateTask = exports.reorderTasks = exports.createTask = exports.getTasks = void 0;
const db_1 = require("../db");
const getTasks = async (req, res) => {
    try {
        const search = typeof req.query.search === "string" ? req.query.search : "";
        const status = typeof req.query.status === "string" ? req.query.status : "";
        const sort = typeof req.query.sort === "string" ? req.query.sort : "";
        let sql = "SELECT * FROM tasks WHERE 1=1";
        const params = [];
        if (search) {
            params.push(`%${search}%`);
            sql += ` AND title ILIKE $${params.length}`;
        }
        if (status === "done")
            sql += " AND done = true";
        if (status === "undone")
            sql += " AND done = false";
        if (sort === "asc")
            sql += " ORDER BY priority ASC";
        else if (sort === "desc")
            sql += " ORDER BY priority DESC";
        else
            sql += " ORDER BY position";
        const result = await (0, db_1.query)(sql, params);
        res.json(result.rows);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to fetch tasks" });
    }
};
exports.getTasks = getTasks;
const createTask = async (req, res) => {
    try {
        const { title, priority, due_date, category } = req.body;
        if (!title)
            return res.status(400).json({ error: "Title is required" });
        const { rows } = await (0, db_1.query)("SELECT COALESCE(MAX(position),0) AS maxPos FROM tasks");
        const maxPos = rows[0].maxpos;
        const prio = Math.max(1, Math.min(10, priority || 1));
        const sql = `
      INSERT INTO tasks (title, priority, done, due_date, category, position)
      VALUES ($1, $2, false, $3, $4, $5)
      RETURNING *
    `;
        const params = [title, prio, due_date || null, category || null, maxPos + 1];
        const result = await (0, db_1.query)(sql, params);
        res.json(result.rows[0]);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to create task" });
    }
};
exports.createTask = createTask;
const reorderTasks = async (req, res) => {
    try {
        const { ids } = req.body;
        const numericIds = ids.map(id => Number(id));
        for (let i = 0; i < numericIds.length; i++) {
            await (0, db_1.query)("UPDATE tasks SET position=$1 WHERE id=$2", [i, numericIds[i]]);
        }
        res.json({ success: true });
    }
    catch (err) {
        res.status(500).json({ error: "Failed to reorder tasks" });
    }
};
exports.reorderTasks = reorderTasks;
const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { done } = req.body;
        const result = await (0, db_1.query)("UPDATE tasks SET done=$1 WHERE id=$2 RETURNING *", [done, id]);
        res.json(result.rows[0]);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to update task" });
    }
};
exports.updateTask = updateTask;
const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        await (0, db_1.query)("DELETE FROM tasks WHERE id=$1", [id]);
        res.json({ success: true });
    }
    catch (err) {
        res.status(500).json({ error: "Failed to delete task" });
    }
};
exports.deleteTask = deleteTask;

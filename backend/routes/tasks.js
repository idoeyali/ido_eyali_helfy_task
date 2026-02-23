const express = require("express");

// Helper functions for validation
function parseIdParam(req) {
    const id = Number(req.params.id);
    return Number.isInteger(id) && id > 0 ? id : null;
}

function isValidPriority(p) {
    return p === "low" || p === "medium" || p === "high";
}

function getTaskIdx(tasks, id) {
    return tasks.findIndex((t) => t.id === id);
}

module.exports = function tasksRoutes(store) {
    const router = express.Router();

    // Get all tasks route
    router.get("/", (req, res) => {
        res.status(200).json(store.tasks);
    });

    // Create a new task route
    router.post("/", (req, res) => {
        const { title, description, priority } = req.body;

        // Request body validation
        if (typeof title !== "string" || title.trim().length === 0) {
            return res.status(400).json({ message: "title is required!", field: "title" });
        }

        if (typeof description !== "string") {
            return res.status(400).json({ message: "description must be a string!", field: "description" });
        }

        if (!isValidPriority(priority)) {
            return res
                .status(400)
                .json({ message: "priority must be low, medium, or high!", field: "priority" });
        }

        const newTask = {
            id: store.nextId++,
            title: title.trim(),
            description: description.trim(),
            completed: false,
            createdAt: new Date().toISOString(),
            priority,
        };

        store.tasks.push(newTask);
        res.status(201).json(newTask);
    });

    // Update a task route
    router.put("/:id", (req, res) => {
        const id = parseIdParam(req);
        if (!id) return res.status(400).json({ message: "Invalid task ID!", field: "id" });

        const idx = getTaskIdx(store.tasks, id);
        if (idx === -1) return res.status(404).json({ message: "Task not found!", field: "id" });

        const { title, description, priority, completed } = req.body;

        // Validation
        if (typeof title !== "string" || title.trim().length === 0) {
            return res.status(400).json({ message: "title is required!", field: "title" });
        }
        if (typeof description !== "string") {
            return res.status(400).json({ message: "description must be a string!", field: "description" });
        }
        if (!isValidPriority(priority)) {
            return res.status(400).json({ message: "priority must be low, medium, or high!", field: "priority" });
        }
        if (typeof completed !== "boolean") {
            return res.status(400).json({ message: "completed must be a boolean!", field: "completed" });
        }

        // Preserve id and createdAt
        const existing = store.tasks[idx];
        const updated = {
            ...existing,
            title: title.trim(),
            description: description.trim(),
            priority,
            completed,
        };

        store.tasks[idx] = updated;
        res.status(200).json(updated);
    });

    // Toggle task completion status route
    router.patch("/:id/toggle", (req, res) => {
        const id = parseIdParam(req);
        if (!id) return res.status(400).json({ message: "Invalid task ID!", field: "id" });

        const idx = getTaskIdx(store.tasks, id);
        if (idx === -1) return res.status(404).json({ message: "Task not found!", field: "id" });

        store.tasks[idx].completed = !store.tasks[idx].completed;
        res.status(200).json(store.tasks[idx]);
    });

    // Delete a task route
    router.delete("/:id", (req, res) => {
        const id = parseIdParam(req);
        if (!id) return res.status(400).json({ message: "Invalid task ID!", field: "id" });

        const idx = getTaskIdx(store.tasks, id);
        if (idx === -1) return res.status(404).json({ message: "Task not found!", field: "id" });

        store.tasks.splice(idx, 1);
        res.status(204).send();
    });

    return router;
};
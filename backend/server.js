const express = require("express");
const cors = require("cors");

const tasksRoutes = require("./routes/tasks");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");

const app = express();
const PORT = 4000;

// Middleware
app.use(cors());
app.use(express.json());

// In memory data store
const store = {
    tasks: [],
    // Global var for generating unique id for tasks
    nextId: 1,
};

// Health check route
app.get("/health", (req, res) => {
    res.status(200).json({ ok: true, message: "Server is running" });
});

// Routes
app.use("/api/tasks", tasksRoutes(store));

// 404 handler
app.use(notFound);

// Global error handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
    console.log(`Backend listening on http://localhost:${PORT}`);
});
import { useEffect, useMemo, useState } from "react";
import "./styles/app.css";
import { deleteTask, getTasks, toggleTask, updateTask } from "./services/tasksApi";
import TaskForm from "./components/TaskForm";
import TaskFilter from "./components/TaskFilter";
import TaskList from "./components/TaskList";
import TaskCarousel from "./components/TaskCarousel";

function App() {
  const [tasks, setTasks] = useState([]);
  const [status, setStatus] = useState("idle"); // idle | loading | ready | error
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all"); // all | pending | completed

  async function loadTasks() {
    setStatus("loading");
    setError(null);

    try {
      const data = await getTasks();
      setTasks(data);
      setStatus("ready");
    } catch (err) {
      setError(err);
      setStatus("error");
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  const visibleTasks = useMemo(() => {
    if (filter === "completed") return tasks.filter((t) => t.completed);
    if (filter === "pending") return tasks.filter((t) => !t.completed);
    return tasks;
  }, [tasks, filter]);

  async function handleToggle(id) {
    try {
      const updated = await toggleTask(id);
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (err) {
      alert(err.message || "Failed to toggle task");
    }
  }

  async function handleDelete(id) {
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      alert(err.message || "Failed to delete task");
    }
  }

  async function handleUpdate(id, payload) {
    try {
      const updated = await updateTask(id, payload);
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (err) {
      alert(err.message || "Failed to update task");
    }
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Task Manager</h1>
        <button className="btn" onClick={loadTasks} disabled={status === "loading"}>
          Refresh
        </button>
      </header>

      <TaskForm
        onTaskCreated={(newTask) => {
          setTasks((prev) => [...prev, newTask]);
        }}
      />

      <TaskFilter value={filter} onChange={setFilter} />

      {status === "loading" && <p>Loading tasks…</p>}

      {status === "error" && (
        <div className="error-box">
          <p>{error?.message || "Something went wrong"}</p>
          {error?.field && <p className="error-field">Field: {error.field}</p>}
        </div>
      )}

      {status === "ready" && (
        <>
          <div className="meta">
            <p>
              Total tasks: {tasks.length} | Showing: {visibleTasks.length}
            </p>
          </div>

          <TaskCarousel
            tasks={visibleTasks}
            onToggle={handleToggle}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
          />
        </>
      )}
    </div>
  );
}

export default App;
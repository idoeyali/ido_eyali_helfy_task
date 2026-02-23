import { useState } from "react";
import { createTask } from "../services/tasksApi";

function TaskForm({ onTaskCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("low");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const newTask = await createTask({
        title,
        description,
        priority,
      });

      // Reset form
      setTitle("");
      setDescription("");
      setPriority("low");

      // Notify parent
      if (onTaskCreated) {
        onTaskCreated(newTask);
      }
    } catch (err) {
      setError(err);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="form-box">
      <h2>Add New Task</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          {error?.field === "title" && (
            <div className="field-error">{error.message}</div>
          )}
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          {error?.field === "description" && (
            <div className="field-error">{error.message}</div>
          )}
        </div>

        <div className="form-group">
          <label>Priority</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          {error?.field === "priority" && (
            <div className="field-error">{error.message}</div>
          )}
        </div>

        <button type="submit" className="btn" disabled={submitting}>
          {submitting ? "Adding..." : "Add Task"}
        </button>

        {error && !error.field && (
          <div className="error-box">{error.message}</div>
        )}
      </form>
    </div>
  );
}

export default TaskForm;
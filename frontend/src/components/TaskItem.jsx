import { useState } from "react";

function TaskItem({ task, onToggle, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);

  // local draft fields (only used in edit mode)
  const [draftTitle, setDraftTitle] = useState(task.title);
  const [draftDescription, setDraftDescription] = useState(task.description || "");
  const [draftPriority, setDraftPriority] = useState(task.priority);

  const [saving, setSaving] = useState(false);

  const created = task.createdAt ? new Date(task.createdAt) : null;

  function startEdit() {
    setDraftTitle(task.title);
    setDraftDescription(task.description || "");
    setDraftPriority(task.priority);
    setIsEditing(true);
  }

  function cancelEdit() {
    setIsEditing(false);
    setSaving(false);
  }

  async function saveEdit() {
    const cleanedTitle = draftTitle.trim();
    if (!cleanedTitle) {
      alert("Title cannot be empty");
      return;
    }

    setSaving(true);

    // PUT requires completed too (your backend validation expects it)
    const payload = {
      title: cleanedTitle,
      description: String(draftDescription).trim(),
      priority: draftPriority,
      completed: task.completed,
    };

    try {
      await onUpdate(payload);
      setIsEditing(false);
    } finally {
      setSaving(false);
    }
  }

  function handleDeleteClick() {
    const ok = window.confirm("Delete this task?");
    if (ok) onDelete();
  }

  // ---------- Edit mode ----------
  if (isEditing) {
    return (
      <div className="task-item editing">
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            value={draftTitle}
            onChange={(e) => setDraftTitle(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            rows="3"
            value={draftDescription}
            onChange={(e) => setDraftDescription(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Priority</label>
          <select
            value={draftPriority}
            onChange={(e) => setDraftPriority(e.target.value)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="task-actions">
          <button className="btn small" type="button" onClick={saveEdit} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </button>

          <button className="btn small" type="button" onClick={cancelEdit} disabled={saving}>
            Cancel
          </button>
        </div>
      </div>
    );
  }

  // ---------- View mode ----------
  return (
    <div className={task.completed ? "task-item done" : "task-item"}>
      <div className="task-top">
        <div>
          <h3 className="task-title">{task.title}</h3>
          {task.description && <p className="task-desc">{task.description}</p>}
        </div>

        <span className={"badge " + task.priority}>{task.priority}</span>
      </div>

      <div className="task-bottom">
        <div className="task-meta">
          {created && (
            <span>
              Created: {created.toLocaleDateString()} {created.toLocaleTimeString()}
            </span>
          )}
          <span>Status: {task.completed ? "Completed" : "Pending"}</span>
        </div>

        <div className="task-actions">
          <button className="btn small" type="button" onClick={onToggle}>
            {task.completed ? "Undo" : "Done"}
          </button>

          <button className="btn small" type="button" onClick={startEdit}>
            Edit
          </button>

          <button className="btn small danger" type="button" onClick={handleDeleteClick}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default TaskItem;
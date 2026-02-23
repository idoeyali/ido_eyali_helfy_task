function TaskItem({ task, onToggle, onDelete }) {
    const created = task.createdAt ? new Date(task.createdAt) : null;
  
    function handleDeleteClick() {
      const ok = window.confirm("Delete this task?");
      if (ok) onDelete();
    }
  
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
  
            <button className="btn small danger" type="button" onClick={handleDeleteClick}>
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  export default TaskItem;
import TaskItem from "./TaskItem";

function TaskList({ tasks, onToggle, onDelete, onUpdate }) {
  if (!tasks.length) {
    return <p>No tasks yet.</p>;
  }

  return (
    <div className="task-list">
      {tasks.map((t) => (
        <TaskItem
          key={t.id}
          task={t}
          onToggle={() => onToggle(t.id)}
          onDelete={() => onDelete(t.id)}
          onUpdate={(payload) => onUpdate(t.id, payload)}
        />
      ))}
    </div>
  );
}

export default TaskList;
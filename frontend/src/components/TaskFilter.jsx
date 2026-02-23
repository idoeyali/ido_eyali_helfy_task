function TaskFilter({ value, onChange }) {
    return (
      <div className="filter-box">
        <span className="filter-label">Show:</span>
  
        <button
          className={value === "all" ? "filter-btn active" : "filter-btn"}
          onClick={() => onChange("all")}
          type="button"
        >
          All
        </button>
  
        <button
          className={value === "pending" ? "filter-btn active" : "filter-btn"}
          onClick={() => onChange("pending")}
          type="button"
        >
          Pending
        </button>
  
        <button
          className={value === "completed" ? "filter-btn active" : "filter-btn"}
          onClick={() => onChange("completed")}
          type="button"
        >
          Completed
        </button>
      </div>
    );
  }
  
  export default TaskFilter;
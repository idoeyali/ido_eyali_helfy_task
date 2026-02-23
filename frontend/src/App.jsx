import { useEffect, useState } from "react";
import "./styles/app.css";
import { getTasks } from "./services/tasksApi";

function App() {
  const [tasks, setTasks] = useState([]);
  const [status, setStatus] = useState("idle"); // idle | loading | ready | error
  const [error, setError] = useState(null);

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

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Task Manager</h1>
        <button className="btn" onClick={loadTasks} disabled={status === "loading"}>
          Refresh
        </button>
      </header>

      {status === "loading" && <p>Loading tasks…</p>}

      {status === "error" && (
        <div className="error-box">
          <p>{error?.message || "Something went wrong"}</p>
          {error?.field && <p className="error-field">Field: {error.field}</p>}
        </div>
      )}

      {status === "ready" && (
        <div className="meta">
          <p>Total tasks: {tasks.length}</p>
        </div>
      )}
    </div>
  );
}

export default App;
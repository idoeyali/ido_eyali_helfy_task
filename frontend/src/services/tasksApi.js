const API_BASE = "http://localhost:4000";

async function request(path, options = {}) {
    const res = await fetch(`${API_BASE}${path}`, {
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {}),
        },
        ...options,
    });

    // Try to parse JSON error bodies 
    let data = null;
    const contentType = res.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
        data = await res.json();
    }
    if (!res.ok) {
        const message = data?.message || `Request failed (${res.status})`;
        const error = new Error(message);
        error.status = res.status;
        error.field = data?.field;
        throw error;
    }

    return data;
}

export function getTasks() {
    return request("/api/tasks");
}

export function createTask(payload) {
    return request("/api/tasks", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export function updateTask(id, payload) {
    return request(`/api/tasks/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
    });
}

export function toggleTask(id) {
    return request(`/api/tasks/${id}/toggle`, { method: "PATCH" });
}

export async function deleteTask(id) {
    const res = await fetch(`${API_BASE}/api/tasks/${id}`, { method: "DELETE" });
    if (!res.ok) {
        let data = null;
        const contentType = res.headers.get("content-type") || "";
        if (contentType.includes("application/json")) data = await res.json();
        const message = data?.message || `Delete failed (${res.status})`;
        const error = new Error(message);
        error.status = res.status;
        error.field = data?.field;
        throw error;
    }
}
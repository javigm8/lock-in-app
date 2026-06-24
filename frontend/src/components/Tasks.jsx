import { useEffect, useState } from "react";
import "../styles/Tasks.css";

const API_BASE = "http://localhost:8080";

function Tasks({ usuario }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");

  const loadTasks = async () => {
    if (!usuario?.id) return;
    const token = localStorage.getItem("token");
    if (!token) {
      setTasks([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/tareas/usuario/${usuario.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setTasks(data);
      } else {
        setTasks([]);
      }
    } catch (e) {
      console.error(e);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [usuario]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!title.trim() || !usuario?.id) return;
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("No token available");
      return;
    }

    const payload = {
      titulo: title.trim(),
      descripcion: "",
      estado: "PENDIENTE",
      prioridad: 1,
      tiempoEstimado: null,
      tiempoReal: null,
      fechaCreacion: new Date().toISOString(),
      fechaLimite: null,
      usuario: { id: usuario.id },
    };

    try {
      const res = await fetch(`${API_BASE}/api/tareas`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setTitle("");
        loadTasks();
      } else {
        console.error("Error creating task", res.status);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/tareas/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 204) {
        setTasks((t) => t.filter((x) => x.id !== id));
      } else {
        console.error("delete failed", res.status);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="tasks-root">
      <form onSubmit={handleAdd} className="task-form">
        <input
          placeholder="Nueva tarea..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          aria-label="Nueva tarea"
        />
        <button type="submit">Añadir</button>
      </form>

      {loading ? (
        <p>Cargando tareas...</p>
      ) : tasks.length === 0 ? (
        <p className="empty-state">No hay tareas</p>
      ) : (
        <ul className="task-list">
          {tasks.map((t) => (
            <li key={t.id} className="task-item">
              <div className="task-main">
                <strong>{t.titulo}</strong>
                <small>{t.estado}</small>
              </div>
              <div className="task-actions">
                <button type="button" onClick={() => handleDelete(t.id)} title="Eliminar">
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Tasks;
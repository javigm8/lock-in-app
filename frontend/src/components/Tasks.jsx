import { useEffect, useState } from "react";
import { Trash, Tag } from "lucide-react";
import "../styles/Tasks.css";

const API_BASE = "http://localhost:8080";

function Tasks({ usuario, etiquetas = [], filtroActivo = [], showLabels = true }) {
  // Estado de tareas, formulario de nueva tarea y asociación de etiquetas
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [tareaEtiquetas, setTareaEtiquetas] = useState({}); // { idTarea: [etiqueta, ...] }
  const [expandedTask, setExpandedTask] = useState(null);

  const token = localStorage.getItem("token");

  const loadTasks = async () => {
    if (!usuario?.id) return;
    if (!token) { setTasks([]); setLoading(false); return; }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/tareas/usuario/${usuario.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setTasks(data);
        await loadEtiquetas(data);
      } else setTasks([]);
    } catch (e) {
      console.error(e); setTasks([]);
    } finally { setLoading(false); }
  };

  const loadEtiquetas = async (tareas) => {
    const map = {};
    await Promise.all(tareas.map(async (t) => {
      const res = await fetch(`${API_BASE}/api/tarea-etiqueta/tarea/${t.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        map[t.id] = data.map((te) => te.etiqueta);
      } else {
        map[t.id] = [];
      }
    }));
    setTareaEtiquetas(map);
  };

  useEffect(() => { loadTasks(); }, [usuario]);

  // Crea nueva tarea en el backend
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!title.trim() || !usuario?.id) return;
    const payload = {
      titulo: title.trim(), descripcion: "", estado: "PENDIENTE", prioridad: 1,
      tiempoEstimado: null, tiempoReal: null,
      fechaCreacion: new Date().toISOString(), fechaLimite: null,
      usuario: { id: usuario.id },
    };
    try {
      const res = await fetch(`${API_BASE}/api/tareas`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      if (res.ok) { setTitle(""); loadTasks(); }
    } catch (err) { console.error(err); }
  };

  // Alterna estado entre PENDIENTE y COMPLETADA
  const handleToggle = async (task) => {
    const nuevoEstado = task.estado === "COMPLETADA" ? "PENDIENTE" : "COMPLETADA";
    try {
      const res = await fetch(`${API_BASE}/api/tareas/${task.id}/estado`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ estado: nuevoEstado }),
      });
      if (res.ok) setTasks((prev) => prev.map((t) => t.id === task.id ? { ...t, estado: nuevoEstado } : t));
    } catch (err) { console.error(err); }
  };

  // Elimina tarea del backend
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/api/tareas/${id}`, {
        method: "DELETE", headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 204) setTasks((t) => t.filter((x) => x.id !== id));
    } catch (err) { console.error(err); }
  };

  // Asigna o quita etiqueta de una tarea
  const toggleEtiquetaEnTarea = async (tarea, etiqueta) => {
    const asignadas = tareaEtiquetas[tarea.id] || [];
    const yaAsignada = asignadas.some((e) => e.id === etiqueta.id);

    if (yaAsignada) {
      const res = await fetch(`${API_BASE}/api/tarea-etiqueta`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ idTarea: tarea.id, idEtiqueta: etiqueta.id }),
      });
      if (res.status === 204) {
        setTareaEtiquetas((prev) => ({
          ...prev,
          [tarea.id]: prev[tarea.id].filter((e) => e.id !== etiqueta.id),
        }));
      }
    } else {
      const res = await fetch(`${API_BASE}/api/tarea-etiqueta`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ idTarea: tarea.id, idEtiqueta: etiqueta.id }),
      });
      if (res.ok) {
        setTareaEtiquetas((prev) => ({
          ...prev,
          [tarea.id]: [...(prev[tarea.id] || []), etiqueta],
        }));
      }
    }
  };

  // Filtra tareas según etiquetas seleccionadas
  const tareasFiltradas = filtroActivo.length === 0
    ? tasks
    : tasks.filter((t) =>
        (tareaEtiquetas[t.id] || []).some((e) => filtroActivo.includes(e.id))
      );

  // Renderiza lista de tareas con checkbox, etiquetas y acciones
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

      {/* Lista de tareas */}
      {loading ? (
        <p>Cargando tareas...</p>
      ) : tareasFiltradas.length === 0 ? (
        <p className="empty-state">No hay tareas</p>
      ) : (
        <ul className="task-list">
          {tareasFiltradas.map((t) => (
            <li key={t.id} className={`task-item${t.estado === "COMPLETADA" ? " task-done" : ""}`}>
              <button
                type="button"
                className={`task-check${t.estado === "COMPLETADA" ? " checked" : ""}`}
                onClick={() => handleToggle(t)}
                aria-label="Marcar como completada"
              />
              <div className="task-main">
                <strong className={t.estado === "COMPLETADA" ? "task-title-done" : ""}>{t.titulo}</strong>
                <div className="task-chips">
                  {(tareaEtiquetas[t.id] || []).map((e) => (
                    <span key={e.id} className="label-chip-small" style={{ borderColor: e.color, color: e.color }}>
                      {e.nombre}
                    </span>
                  ))}
                </div>
              </div>
              <div className="task-actions">
                {showLabels && (
                  <button type="button" onClick={() => setExpandedTask(expandedTask === t.id ? null : t.id)} title="Etiquetas">
                    <Tag size={16} />
                  </button>
                )}
                <button type="button" onClick={() => handleDelete(t.id)} title="Eliminar">
                  <Trash size={16} color="red" />
                </button>
              </div>

              {expandedTask === t.id && etiquetas.length > 0 && (
                <div className="task-label-selector">
                  {etiquetas.map((e) => {
                    const asignada = (tareaEtiquetas[t.id] || []).some((x) => x.id === e.id);
                    return (
                      <button
                        key={e.id}
                        type="button"
                        className={`label-chip${asignada ? " active" : ""}`}
                        style={{ borderColor: e.color, color: e.color }}
                        onClick={() => toggleEtiquetaEnTarea(t, e)}
                      >
                        {e.nombre}
                      </button>
                    );
                  })}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Tasks;
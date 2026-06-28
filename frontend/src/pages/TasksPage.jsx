import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Shrink, Plus, Trash } from "lucide-react";
import Tasks from "../components/Tasks";
import "../styles/Tasks.css";

const API_BASE = "http://localhost:8080";

// Paleta de colores para etiquetas personalizadas
const COLORS = [
  "#E57373", "#FFB74D", "#FFF176", "#7FAF82",
  "#64B5F6", "#BA68C8", "#F48FB1", "#90A4AE"
];

function TasksPage() {
  const navigate = useNavigate();
  const [usuario] = useState(() => JSON.parse(localStorage.getItem("usuario")));
  // Estado de etiquetas, filtros activos y formulario nueva etiqueta
  const [labels, setLabels] = useState([]);
  const [activeFilter, setActiveFilter] = useState([]);
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState(COLORS[0]);
  const [showForm, setShowForm] = useState(false);

  const token = localStorage.getItem("token");

  const loadLabels = async () => {
    if (!usuario?.id) return;
    const res = await fetch(`${API_BASE}/api/etiquetas/usuario/${usuario.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) setLabels(await res.json());
  };

  useEffect(() => { loadLabels(); }, [usuario]);

  const handleCreateLabel = async () => {
    if (!newName.trim()) return;
    // Crea nueva etiqueta personalizada
    const res = await fetch(`${API_BASE}/api/etiquetas`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ nombre: newName.trim(), color: newColor, usuario: { id: usuario.id } }),
    });
    if (res.ok) {
      setNewName("");
      setNewColor(COLORS[0]);
      setShowForm(false);
      loadLabels();
    }
  };

  const handleDeleteLabel = async (id) => {
    // Elimina etiqueta y quita filtros relacionados
    const res = await fetch(`${API_BASE}/api/etiquetas/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.status === 204) {
      setLabels((prev) => prev.filter((e) => e.id !== id));
      setActiveFilter((prev) => prev.filter((x) => x !== id));
    }
  };

  const toggleFilter = (id) => {
    // Alterna filtro de etiqueta
    setActiveFilter((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <>
      <header className="topbar">
        <div>
          <span className="panel-kicker">Organización</span>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em" }}>Tareas</h2>
        </div>
        <div />
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button className="nav-button" onClick={() => navigate("/dashboard")} title="Volver al dashboard">
            <Shrink size={20} />
          </button>
        </div>
      </header>

      <div style={{ padding: "24px 0" }}>
        <div className="labels-section">
          <div className="labels-header">
            <span className="labels-title">Etiquetas</span>
            <button className="label-add-btn" onClick={() => setShowForm((v) => !v)}>
              <Plus size={14} /> Nueva
            </button>
          </div>

          {showForm && (
            <div className="label-form">
              <input
                placeholder="Nombre de etiqueta"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreateLabel()}
                className="label-input"
              />
              <div className="color-picker">
                {COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={`color-dot${newColor === c ? " selected" : ""}`}
                    style={{ background: c }}
                    onClick={() => setNewColor(c)}
                  />
                ))}
              </div>
              <button className="label-create-btn" onClick={handleCreateLabel}>Crear</button>
            </div>
          )}

          <div className="labels-list">
            {labels.map((e) => (
              <div key={e.id} className="label-chip-manage">
                <span
                  className={`label-chip${activeFilter.includes(e.id) ? " active" : ""}`}
                  style={{ borderColor: e.color, color: e.color }}
                  onClick={() => toggleFilter(e.id)}
                >
                  {e.nombre}
                </span>
                <button className="label-delete-btn" onClick={() => handleDeleteLabel(e.id)}>
                  <Trash size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <Tasks usuario={usuario} etiquetas={labels} filtroActivo={activeFilter} />
      </div>
    </>
  );
}

export default TasksPage;
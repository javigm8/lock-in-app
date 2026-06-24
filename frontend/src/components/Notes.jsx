import { useEffect, useState } from "react";
import "../styles/Notes.css";

const API_BASE = "http://localhost:8080";

function Notes({ usuario }) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [titulo, setTitulo] = useState("");
  const [contenido, setContenido] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [editContenido, setEditContenido] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const loadNotes = async () => {
    if (!usuario?.id) return;
    const token = localStorage.getItem("token");
    if (!token) {
      setNotes([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/notas/usuario/${usuario.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setNotes(data);
      } else {
        setNotes([]);
      }
    } catch (e) {
      console.error(e);
      setNotes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotes();
  }, [usuario]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!titulo.trim() || !usuario?.id) return;
    const token = localStorage.getItem("token");
    if (!token) return;

    const payload = {
      titulo: titulo.trim(),
      contenido: contenido.trim(),
      fechaCreacion: new Date().toISOString(),
      fechaModificacion: new Date().toISOString(),
      usuario: { id: usuario.id },
    };

    try {
      const res = await fetch(`${API_BASE}/api/notas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setTitulo("");
        setContenido("");
        loadNotes();
      } else {
        console.error("Error creating note", res.status);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_BASE}/api/notas/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 204) {
        setNotes((n) => n.filter((x) => x.id !== id));
        if (expandedId === id) setExpandedId(null);
        setConfirmDeleteId(null);
      } else {
        console.error("delete failed", res.status);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleExpand = (note) => {
    if (expandedId === note.id) {
      setExpandedId(null);
    } else {
      setExpandedId(note.id);
      setEditContenido(note.contenido || "");
    }
  };

  const handleSaveEdit = async (note) => {
    const token = localStorage.getItem("token");
    const payload = {
      id: note.id,
      titulo: note.titulo,
      contenido: editContenido,
      fechaCreacion: note.fechaCreacion,
      fechaModificacion: new Date().toISOString(),
      usuario: { id: usuario.id },
    };

    try {
      const res = await fetch(`${API_BASE}/api/notas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setExpandedId(null);
        loadNotes();
      } else {
        console.error("Error updating note", res.status);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="notes-root">
      <form onSubmit={handleAdd} className="note-form">
        <input
          placeholder="Título de la nota..."
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          aria-label="Título de la nota"
        />
        <textarea
          placeholder="Contenido (opcional)..."
          value={contenido}
          onChange={(e) => setContenido(e.target.value)}
          aria-label="Contenido de la nota"
          rows={2}
        />
        <button type="submit">Añadir</button>
      </form>

      {loading ? (
        <p>Cargando notas...</p>
      ) : notes.length === 0 ? (
        <p className="empty-state">No hay notas</p>
      ) : (
        <ul className="note-list">
          {notes.map((n) => (
            <li key={n.id} className="note-item">
              <div className="note-main" onClick={() => handleExpand(n)}>
                <strong>{n.titulo}</strong>
                {expandedId !== n.id && n.contenido && (
                  <small className="note-preview">{n.contenido}</small>
                )}
              </div>

              {expandedId === n.id && (
                <div className="note-editor">
                  <textarea
                    value={editContenido}
                    onChange={(e) => setEditContenido(e.target.value)}
                    rows={4}
                    aria-label="Editar contenido"
                  />
                  <div className="note-editor-actions">
                    <button
                      type="button"
                      className="save-button"
                      onClick={() => handleSaveEdit(n)}
                    >
                      Guardar
                    </button>
                    <button
                      type="button"
                      className="cancel-button"
                      onClick={() => setExpandedId(null)}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}

              <div className="note-actions">
                {confirmDeleteId === n.id ? (
                  <>
                    <span className="confirm-label">¿Seguro?</span>
                    <button
                      type="button"
                      className="confirm-yes"
                      onClick={() => handleDelete(n.id)}
                    >
                      Sí
                    </button>
                    <button
                      type="button"
                      className="confirm-no"
                      onClick={() => setConfirmDeleteId(null)}
                    >
                      No
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmDeleteId(n.id)}
                    title="Eliminar"
                  >
                    Eliminar
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Notes;
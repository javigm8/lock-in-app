import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Shrink, Plus, X, Trash2 } from "lucide-react";
import Temp from "../components/Temp";
import { useTimer } from "../TimerContext";

function TempPage() {
  const navigate = useNavigate();
  const [usuario] = useState(() => JSON.parse(localStorage.getItem("usuario")));
  // Estados de perfiles predefinidos, personalizados y seleccionado
  const { perfiles, perfilActual, setPerfilActual, running, cargarPerfiles } = useTimer();

  // Formulario para crear nuevo perfil personalizado
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [nuevaDuracion, setNuevaDuracion] = useState("");
  const [nuevosCiclos, setNuevosCiclos] = useState(1);

  const crearPerfilCustom = () => {
    if (!nuevoNombre.trim()) return;
    if (!nuevaDuracion || nuevaDuracion < 1) return;
    if (!nuevosCiclos || nuevosCiclos < 1) return;
    const token = localStorage.getItem("token");
    fetch("http://localhost:8080/api/perfiles-sesion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        nombre: nuevoNombre,
        duracion: parseInt(nuevaDuracion),
        ciclos: parseInt(nuevosCiclos),
        esCustom: true,
        usuario: { id: usuario.id },
      }),
    })
      .then((r) => r.json())
      .then((nuevo) => {
        setNuevoNombre("");
        setNuevaDuracion("");
        setNuevosCiclos("1");
        setShowCustomForm(false);
        cargarPerfiles();
        setPerfilActual(nuevo);
      })
      .catch(console.error);
  };

  const eliminarPerfil = (perfil) => {
    const token = localStorage.getItem("token");
    fetch(`http://localhost:8080/api/perfiles-sesion/${perfil.id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    }).then(() => {
      cargarPerfiles();
      setPerfilActual(null);
    });
  };

  return (
    <>
      <header className="topbar">
        <div>
          <span className="panel-kicker">Sesiones</span>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em" }}>
            Temporizador
          </h2>
        </div>
        <div className="perfil-controls">
          {perfiles.length > 0 && (
            <select
              className="perfil-select"
              value={perfilActual?.id ?? ""}
              onChange={(e) => {
                const p = perfiles.find((x) => x.id === parseInt(e.target.value));
                if (p) setPerfilActual(p);
              }}
              disabled={running}
            >
              {perfiles.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre} ({p.duracion} min · {p.ciclos} ciclo{p.ciclos !== 1 ? "s" : ""})
                </option>
              ))}
            </select>
          )}
          {perfilActual?.esCustom && !running && (
            <button className="perfil-delete-btn" onClick={() => eliminarPerfil(perfilActual)} title="Eliminar perfil">
              <Trash2 size={14} />
            </button>
          )}
          {!running && (
            <button className="perfil-add-btn" onClick={() => setShowCustomForm((v) => !v)} title="Nuevo perfil">
              {showCustomForm ? <X size={16} /> : <Plus size={16} />}
            </button>
          )}
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button className="nav-button" onClick={() => navigate("/dashboard")} title="Volver al dashboard">
            <Shrink size={20} />
          </button>
        </div>
      </header>

      {showCustomForm && (
        // Formulario para crear perfil personalizado
        <div className="perfil-form" style={{ margin: "12px 0" }}>
          <input className="perfil-form-input" placeholder="Nombre" value={nuevoNombre} onChange={(e) => setNuevoNombre(e.target.value)} />
          <label>Duración (min)
            <input className="perfil-form-input" type="number" min={1} max={120} value={nuevaDuracion} onChange={(e) => setNuevaDuracion(e.target.value)} />
          </label>
          <label>Ciclos
            <input className="perfil-form-input" type="number" min={1} max={20} value={nuevosCiclos} onChange={(e) => setNuevosCiclos(e.target.value)} />
          </label>
          <button className="perfil-form-save" onClick={crearPerfilCustom}>Guardar</button>
        </div>
      )}

      {/* Pantalla principal del temporizador */}
      <div className="temp-page-wrapper">
        <Temp />
      </div>
    </>
  );
}

export default TempPage;
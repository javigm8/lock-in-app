import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home,
  ClipboardList,
  Timer,
  StickyNote,
  LayoutDashboard,
  BarChart2,
  Settings,
  LogOut,
  User,
  Plus,
  X,
  Trash2,
} from "lucide-react";
import "../styles/Dashboard.css";
import Tasks from "../components/Tasks";
import Notes from "../components/Notes";
import Pomodoro from "../components/Pomodoro";
import Statistics from "../components/Statistics";
import AmbientPlayer from "../components/AmbientPlayer";

function Dashboard() {
  const navigate = useNavigate();

  const [usuarioActual] = useState(() => {
    const usuarioGuardado = localStorage.getItem("usuario");
    return usuarioGuardado ? JSON.parse(usuarioGuardado) : null;
  });

  const [running, setRunning] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const menuRef = useRef(null);
  const [perfiles, setPerfiles] = useState([]);
  const [perfilActual, setPerfilActual] = useState(null);
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [nuevaDuracion, setNuevaDuracion] = useState(25);
  const [nuevosCiclos, setNuevosCiclos] = useState(4);
  const [pizarraPreview, setPizarraPreview] = useState(null);

  const cargarPerfiles = () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    Promise.all([
      fetch("http://localhost:8080/api/perfiles-sesion/predefinidos", {
        headers: { Authorization: `Bearer ${token}` },
      }).then((r) => r.json()),
      fetch(
        `http://localhost:8080/api/perfiles-sesion/usuario/${usuarioActual?.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      ).then((r) => r.json()),
    ])
      .then(([predefinidos, custom]) => {
        const todos = [...predefinidos, ...custom.filter((p) => p.esCustom)];
        setPerfiles(todos);
        if (todos.length > 0) setPerfilActual((prev) => prev ?? todos[0]);
      })
      .catch(console.error);
  };

  useEffect(() => {
    cargarPerfiles();
  }, []);

  useEffect(() => {
    const handleClickFuera = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuAbierto(false);
      }
    };
    document.addEventListener("mousedown", handleClickFuera);
    return () => document.removeEventListener("mousedown", handleClickFuera);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || !usuarioActual) return;
    fetch(`http://localhost:8080/api/pizarras/usuario/${usuarioActual.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.length > 0 && data[0].datos) {
          try {
            const parsed = JSON.parse(data[0].datos);
            if (parsed?.imagen) setPizarraPreview(parsed.imagen);
          } catch (e) {
            console.error("Error parseando datos de pizarra", e);
          }
        }
      })
      .catch(console.error);
  }, []);

  const crearPerfilCustom = () => {
    if (!nuevoNombre.trim()) return;
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
        usuario: { id: usuarioActual.id },
      }),
    })
      .then((r) => r.json())
      .then((nuevo) => {
        setNuevoNombre("");
        setNuevaDuracion(25);
        setNuevosCiclos(4);
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

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    navigate("/");
  };

  const navItems = [
    { icon: <Home size={22} />, label: "Inicio", active: true },
    { icon: <ClipboardList size={22} />, label: "Tareas" },
    { icon: <Timer size={22} />, label: "Temporizador" },
    { icon: <StickyNote size={22} />, label: "Notas" },
    { icon: <LayoutDashboard size={22} />, label: "Pizarra" },
    { icon: <BarChart2 size={22} />, label: "Estadísticas" },
  ];

  return (
    <div className="dashboard-shell">
      <aside className="sidebar" aria-label="Navegación principal">
        <button className="brand-mark" type="button" aria-label="Inicio">
          <span>L</span>
        </button>

        <nav className="sidebar-nav">
          {navItems.map(({ icon, label, active }) => (
            <button
              key={label}
              type="button"
              className={`nav-button ${active ? "active" : ""}`}
              title={label}
              aria-label={label}
            >
              {icon}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <AmbientPlayer />
          <button
            className="nav-button"
            type="button"
            title="Ajustes"
            aria-label="Ajustes"
            onClick={() => navigate("/settings")}
          >
            <Settings size={22} />
          </button>
        </div>
      </aside>

      <main className="dashboard-main">
        <header className="topbar">
          <div>
            <h1>
              Lock <span>In!</span>
            </h1>
          </div>

          <div className="topbar-center">
            <span className={`focus-dot ${running ? "running" : ""}`} />
            <strong>
              {running ? "Sesión en curso" : "Listo para concentrarte"}
            </strong>
          </div>

          <div className="profile-wrapper" ref={menuRef}>
            <button
              className="profile-button"
              type="button"
              onClick={() => setMenuAbierto((v) => !v)}
            >
              <div className="profile-copy">
                <strong>¡Hola, {usuarioActual?.nombre || "Usuario"}!</strong>
              </div>
              <span className="avatar">
                <User size={20} />
              </span>
            </button>

            {menuAbierto && (
              <div className="profile-menu">
                <button className="profile-menu-item logout" onClick={logout}>
                  <LogOut size={16} /> Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </header>

        <section className="dashboard-grid">
          <article className="panel tasks-panel">
            <div className="panel-heading">
              <div>
                <span className="panel-kicker">Organización</span>
                <h2>Tareas</h2>
              </div>
            </div>
            <div className="panel-body">
              <Tasks usuario={usuarioActual} />
            </div>
          </article>

          <article className="panel timer-panel">
            <div className="panel-heading">
              <div>
                <span className="panel-kicker">Pomodoro</span>
                <h2>Temporizador</h2>
              </div>
              <div className="perfil-controls">
                {perfiles.length > 0 && (
                  <select
                    className="perfil-select"
                    value={perfilActual?.id ?? ""}
                    onChange={(e) => {
                      const p = perfiles.find(
                        (x) => x.id === parseInt(e.target.value),
                      );
                      if (p) setPerfilActual(p);
                    }}
                    disabled={running}
                    aria-label="Seleccionar perfil de sesión"
                  >
                    {perfiles.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nombre} ({p.duracion} min · {p.ciclos} ciclo
                        {p.ciclos !== 1 ? "s" : ""})
                      </option>
                    ))}
                  </select>
                )}
                {perfilActual?.esCustom && !running && (
                  <button
                    className="perfil-delete-btn"
                    onClick={() => eliminarPerfil(perfilActual)}
                    title="Eliminar perfil"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
                {!running && (
                  <button
                    className="perfil-add-btn"
                    onClick={() => setShowCustomForm((v) => !v)}
                    title="Nuevo perfil"
                  >
                    {showCustomForm ? <X size={16} /> : <Plus size={16} />}
                  </button>
                )}
              </div>
              {showCustomForm && (
                <div className="perfil-form">
                  <input
                    className="perfil-form-input"
                    placeholder="Nombre"
                    value={nuevoNombre}
                    onChange={(e) => setNuevoNombre(e.target.value)}
                  />
                  <label>
                    Duración (min)
                    <input
                      className="perfil-form-input"
                      type="number"
                      min={1}
                      max={120}
                      value={nuevaDuracion}
                      onChange={(e) => setNuevaDuracion(e.target.value)}
                    />
                  </label>
                  <label>
                    Ciclos
                    <input
                      className="perfil-form-input"
                      type="number"
                      min={1}
                      max={20}
                      value={nuevosCiclos}
                      onChange={(e) => setNuevosCiclos(e.target.value)}
                    />
                  </label>
                  <button
                    className="perfil-form-save"
                    onClick={crearPerfilCustom}
                  >
                    Guardar
                  </button>
                </div>
              )}
            </div>
            <div className="panel-body">
              <Pomodoro
                usuario={usuarioActual}
                running={running}
                setRunning={setRunning}
                perfilActual={perfilActual}
              />
            </div>
          </article>

          <article className="panel notes-panel">
            <div className="panel-heading">
              <div>
                <span className="panel-kicker">Apuntes rápidos</span>
                <h2>Notas</h2>
              </div>
            </div>
            <div className="panel-body">
              <Notes usuario={usuarioActual} />
            </div>
          </article>

          <article className="panel stats-panel">
            <div className="panel-heading">
              <div>
                <span className="panel-kicker">Tu progreso</span>
                <h2>Estadísticas</h2>
              </div>
            </div>
            <div className="panel-body">
              <Statistics usuario={usuarioActual} />
            </div>
          </article>

          <article
            className="panel board-panel"
            onClick={() => navigate("/pizarra")}
            style={{ cursor: "pointer" }}
          >
            <div className="panel-heading">
              <div>
                <span className="panel-kicker">Espacio visual</span>
                <h2>Pizarra</h2>
              </div>
            </div>
            <div className="panel-body board-preview">
              {pizarraPreview ? (
                <img
                  src={pizarraPreview}
                  alt="Previsualización pizarra"
                  className="board-thumbnail"
                />
              ) : (
                <p className="empty-state">Abrir pizarra</p>
              )}
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;

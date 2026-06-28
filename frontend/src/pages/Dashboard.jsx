import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, User, Maximize2, UserCog } from "lucide-react";
import "../styles/Dashboard.css";
import Tasks from "../components/Tasks";
import Notes from "../components/Notes";
import Temp from "../components/Temp";
import Statistics from "../components/Statistics";
import { useTimer } from "../TimerContext";
import ProfileModal from "../components/ProfileModal";

function Dashboard() {
  const navigate = useNavigate();

  // Carga datos del usuario desde localStorage
  const [usuarioActual, setUsuarioActual] = useState(() => {
    const usuarioGuardado = localStorage.getItem("usuario");
    return usuarioGuardado ? JSON.parse(usuarioGuardado) : null;
  });

  // Obtiene estado del timer desde el context
  const { running, perfiles, perfilActual, setPerfilActual } = useTimer();

  // Estados para menú de usuario, pizarra preview y modal de perfil
  const [menuAbierto, setMenuAbierto] = useState(false);
  const menuRef = useRef(null);
  const [pizarraPreview, setPizarraPreview] = useState(null);
  const [modalPerfil, setModalPerfil] = useState(false);

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

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    navigate("/");
  };

  return (
    <>
      {modalPerfil && (
        <ProfileModal
          usuario={usuarioActual}
          onClose={() => setModalPerfil(false)}
          onSave={(usuarioActualizado) => {
            setUsuarioActual(usuarioActualizado);
            localStorage.setItem('usuario', JSON.stringify(usuarioActualizado))
          }}
        />
      )}

      <header className="topbar">
        {/* Título y logo */}
        <div>
          <h1>
            Lock <span>In!</span>
          </h1>
        </div>

        {/* Indicador de sesión activa */}
        <div className="topbar-center">
          <span className={`focus-dot ${running ? "running" : ""}`} />
          <strong>
            {running ? "Sesión en curso" : "Listo para concentrarte"}
          </strong>
        </div>

        {/* Menú de usuario con opciones */}
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
              {usuarioActual?.configuracion && JSON.parse(usuarioActual.configuracion).avatar
                ? <img src={JSON.parse(usuarioActual.configuracion).avatar} alt="avatar" className="avatar-img" />
                : <User size={20} />
              }
            </span>
          </button>

          {menuAbierto && (
            <div className="profile-menu">
              <button
                className="profile-menu-item"
                onClick={() => {
                  setModalPerfil(true);
                  setMenuAbierto(false);
                }}
              >
                <UserCog size={16} /> Editar perfil
              </button>
              <button className="profile-menu-item logout" onClick={logout}>
                <LogOut size={16} /> Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Paneles de contenido: tareas, timer, notas, etc */}
      <section className="dashboard-grid">
        <article className="panel tasks-panel">
          <div className="panel-heading">
            <div>
              <span className="panel-kicker">Organización</span>
              <h2>Tareas</h2>
            </div>
            <button
              className="panel-expand-btn"
              onClick={() => navigate("/tareas")}
              title="Expandir"
            >
              <Maximize2 size={15} />
            </button>
          </div>
          <div className="panel-body">
            <Tasks usuario={usuarioActual} showLabels={false} />
          </div>
        </article>

        <article className="panel timer-panel">
          <div className="panel-heading">
            <div>
              <span className="panel-kicker">Sesiones</span>
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
              <button
                className="panel-expand-btn"
                onClick={() => navigate("/temporizador")}
                title="Expandir"
              >
                <Maximize2 size={15} />
              </button>
            </div>
          </div>
          <div className="panel-body">
            <Temp />
          </div>
        </article>

        <article className="panel notes-panel">
          <div className="panel-heading">
            <div>
              <span className="panel-kicker">Apuntes rápidos</span>
              <h2>Notas</h2>
            </div>
            <button
              className="panel-expand-btn"
              onClick={() => navigate("/notas")}
              title="Expandir"
            >
              <Maximize2 size={15} />
            </button>
          </div>
          <div className="panel-body">
            <Notes usuario={usuarioActual} compact={true} showForm={false} onNoteClick={() => navigate("/notas")} />
          </div>
        </article>

        <article className="panel stats-panel">
          <div className="panel-heading">
            <div>
              <span className="panel-kicker">Tu progreso</span>
              <h2>Estadísticas</h2>
            </div>
            <button
              className="panel-expand-btn"
              onClick={() => navigate("/estadisticas")}
              title="Expandir"
            >
              <Maximize2 size={15} />
            </button>
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
    </>
  );
}

export default Dashboard;

import { useEffect, useMemo, useState } from "react";
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
  Play,
  Pause,
  RotateCcw,
} from "lucide-react";
import "./Dashboard.css";
import Tasks from "../components/Tasks";

function Dashboard() {
  const navigate = useNavigate();

  const [usuarioActual] = useState(() => {
    const usuarioGuardado = localStorage.getItem("usuario");
    return usuarioGuardado ? JSON.parse(usuarioGuardado) : null;
  });

  const [seconds, setSeconds] = useState(25 * 60);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) {
      return;
    }

    const timer = setInterval(() => {
      setSeconds((currentSeconds) => {
        if (currentSeconds <= 1) {
          clearInterval(timer);
          setRunning(false);
          return 25 * 60;
        }
        return currentSeconds - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [running]);

  const timeLabel = useMemo(() => {
    const minutes = String(Math.floor(seconds / 60)).padStart(2, "0");
    const remainingSeconds = String(seconds % 60).padStart(2, "0");
    return `${minutes}:${remainingSeconds}`;
  }, [seconds]);

  const resetTimer = () => {
    setRunning(false);
    setSeconds(25 * 60);
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
          <button
            className="nav-button"
            type="button"
            title="Ajustes"
            aria-label="Ajustes"
            onClick={() => navigate('/settings')}
          >
            <Settings size={22} />
          </button>

          <button
            className="nav-button logout-button"
            type="button"
            title="Cerrar sesión"
            aria-label="Cerrar sesión"
            onClick={logout}
          >
            <LogOut size={22} />
          </button>
        </div>
      </aside>

      <main className="dashboard-main">
        <header className="topbar">
          <div>
            <p className="eyebrow">Panel principal</p>
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

          <button className="profile-button" type="button">
            <div className="profile-copy">
              <strong>¡Hola, {usuarioActual?.nombre || "Usuario"}!</strong>
              <span>Modo concentración</span>
            </div>
            <span className="avatar">
              <User size={20} />
            </span>
          </button>
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
              <span className="panel-badge">25 min</span>
            </div>

            <div
              className="timer-ring"
              style={{
                "--timer-progress": `${(seconds / (25 * 60)) * 360}deg`,
              }}
            >
              <div className="timer-inner">
                <span>{timeLabel}</span>
                <small>
                  {running ? "Mantén el foco" : "Sesión de trabajo"}
                </small>
              </div>
            </div>

            <div className="timer-controls">
              <button
                className="primary-control"
                type="button"
                onClick={() => setRunning(!running)}
              >
                {running ? <Pause size={18} /> : <Play size={18} />}
                {running ? "Pausar" : "Comenzar"}
              </button>

              <button
                className="secondary-control"
                type="button"
                onClick={resetTimer}
                aria-label="Reiniciar temporizador"
              >
                <RotateCcw size={18} />
              </button>
            </div>
          </article>

          <article className="panel notes-panel">
            <div className="panel-heading">
              <div>
                <span className="panel-kicker">Apuntes rápidos</span>
                <h2>Notas</h2>
              </div>
            </div>
            <p className="empty-state">PENDIENTE</p>
          </article>

          <article className="panel stats-panel">
            <div className="panel-heading">
              <div>
                <span className="panel-kicker">Tu progreso</span>
                <h2>Estadísticas</h2>
              </div>
            </div>
            <p className="empty-state">PENDIENTE</p>
          </article>

          <article className="panel board-panel">
            <div className="panel-heading">
              <div>
                <span className="panel-kicker">Espacio visual</span>
                <h2>Pizarra</h2>
              </div>
            </div>
            <p className="empty-state">PENDIENTE</p>
          </article>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;

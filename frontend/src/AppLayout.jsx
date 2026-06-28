import { useNavigate, useLocation, Outlet } from "react-router-dom";
import {
  Home,
  ClipboardList,
  Timer,
  StickyNote,
  BarChart2,
  Settings,
} from "lucide-react";
import AmbientPlayer from "./components/AmbientPlayer";
import "./styles/AppLayout.css";

// Opciones de navegación principal para la barra lateral
const navItems = [
  { icon: <Home size={22} />, label: "Inicio", path: "/dashboard" },
  { icon: <ClipboardList size={22} />, label: "Tareas", path: "/tareas" },
  { icon: <Timer size={22} />, label: "Temporizador", path: "/temporizador" },
  { icon: <StickyNote size={22} />, label: "Notas", path: "/notas" },
  { icon: <BarChart2 size={22} />, label: "Estadísticas", path: "/estadisticas" },
];

function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="dashboard-shell">
      {/* Barra lateral con navegación, sonido ambiental y ajustes */}
      <aside className="sidebar" aria-label="Navegación principal">
        <button
          className="brand-mark"
          type="button"
          aria-label="Inicio"
          onClick={() => navigate("/dashboard")}
        >
          <span>L</span>
        </button>

        <nav className="sidebar-nav">
          {navItems.map(({ icon, label, path }) => (
            <button
              key={label}
              type="button"
              className={`nav-button ${location.pathname === path ? "active" : ""}`}
              title={label}
              aria-label={label}
              onClick={() => navigate(path)}
            >
              {icon}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          {/* Reproductor de sonidos y botón ajustes */}
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

      {/* Área principal de contenido dinámico */}
      <main className="dashboard-main">
        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;
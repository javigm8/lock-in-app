import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTheme } from "../theme.jsx";
import { Sun, Moon } from 'lucide-react'

function Settings() {
  const navigate = useNavigate();
  const { theme, toggleTheme, colors } = useTheme();

  const [usuario] = useState(() => JSON.parse(localStorage.getItem("usuario")));
  const token = localStorage.getItem("token");

  // Estado para perfiles disponibles y selección de perfil por defecto
  const [perfiles, setPerfiles] = useState([]);
  const [perfilPorDefecto, setPerfilPorDefecto] = useState(null);
  const [confirmarEliminar, setConfirmarEliminar] = useState(false);

  useEffect(() => {
    if (!usuario) return;
    Promise.all([
      fetch("http://localhost:8080/api/perfiles-sesion/predefinidos", {
        headers: { Authorization: `Bearer ${token}` },
      }).then((r) => r.json()),
      fetch(`http://localhost:8080/api/perfiles-sesion/usuario/${usuario.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then((r) => r.json()),
    ])
      .then(([predefinidos, custom]) => {
        const todos = [...predefinidos, ...custom.filter((p) => p.esCustom)];
        setPerfiles(todos);

        const config = usuario.configuracion
          ? JSON.parse(usuario.configuracion)
          : {};
        if (config.perfilPorDefecto) {
          setPerfilPorDefecto(config.perfilPorDefecto);
        } else if (todos.length > 0) {
          setPerfilPorDefecto(todos[0].id);
        }
      })
      .catch(console.error);
  }, []);

  const handlePerfilDefecto = (id) => {
    setPerfilPorDefecto(id);
    const config = usuario.configuracion
      ? JSON.parse(usuario.configuracion)
      : {};
    const nuevaConfig = JSON.stringify({ ...config, perfilPorDefecto: id });

    fetch(`http://localhost:8080/api/usuarios/${usuario.id}/configuracion`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: nuevaConfig,
    })
      .then((r) => r.json())
      .then((usuarioActualizado) => {
        localStorage.setItem("usuario", JSON.stringify(usuarioActualizado));
      })
      .catch(console.error);
  };

  const handleEliminarCuenta = () => {
    fetch(`http://localhost:8080/api/usuarios/${usuario.id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");
        navigate("/");
      })
      .catch(console.error);
  };

  const sectionStyle = {
    marginTop: "18px",
    padding: "28px",
    borderRadius: "24px",
    background: colors.bgSurface,
    boxShadow: "0 20px 50px rgba(0,0,0,0.12)",
  };

  const rowStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
  };

  return (
    <div
      style={{
        padding: "40px 24px",
        color: colors.textPrimary,
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      <div style={{ maxWidth: "760px", margin: "0 auto" }}>
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          style={{
            marginBottom: "24px",
            background: "transparent",
            border: `1px solid ${colors.textMuted}`,
            color: colors.textPrimary,
            borderRadius: "12px",
            padding: "10px 14px",
            cursor: "pointer",
          }}
        >
          ← Volver al panel
        </button>

        <h1
          style={{
            margin: "0 0 6px",
            fontSize: "2rem",
            letterSpacing: "-0.03em",
          }}
        >
          Ajustes
        </h1>
        <p
          style={{
            color: colors.textMuted,
            marginTop: "10px",
            maxWidth: "620px",
          }}
        >
          Configura tu experiencia de Lock In!
        </p>

        {/* Tema */}
        <section style={sectionStyle}>
          <div style={rowStyle}>
            <div>
              <h2 style={{ margin: 0, fontSize: "1.15rem" }}>Tema</h2>
              <p
                style={{
                  margin: "8px 0 0",
                  color: colors.textMuted,
                  fontSize: "0.95rem",
                }}
              >
                Cambia la apariencia entre modo claro y modo oscuro.
              </p>
            </div>
            <button
              type="button"
              onClick={toggleTheme}
              style={{
                minWidth: "150px",
                padding: "12px 18px",
                borderRadius: "999px",
                border: "none",
                cursor: "pointer",
                background: theme === "light" ? "#172018" : colors.accentMain,
                color: theme === "light" ? "#F5F3EE" : "#172018",
                fontWeight: 700,
              }}
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
              <span style={{ marginLeft: '8px' }}>
                {theme === 'light' ? 'Modo oscuro' : 'Modo claro'}
              </span>
            </button>
          </div>
        </section>

        {/* Idioma */}
        <section style={sectionStyle}>
          <div style={rowStyle}>
            <div>
              <h2 style={{ margin: 0, fontSize: "1.15rem" }}>Idioma</h2>
              <p
                style={{
                  margin: "8px 0 0",
                  color: colors.textMuted,
                  fontSize: "0.95rem",
                }}
              >
                Idioma de la interfaz.
              </p>
            </div>
            <select
              disabled
              style={{
                border: `1px solid ${colors.textMuted}`,
                borderRadius: "10px",
                background: colors.bgDark,
                color: colors.textMuted,
                padding: "10px 14px",
                fontSize: "0.9rem",
                minWidth: "220px",
                opacity: 0.5,
                cursor: "not-allowed",
              }}
            >
              <option>Español</option>
            </select>
          </div>
        </section>

        {/* Temporizador por defecto */}
        <section style={sectionStyle}>
          <div style={rowStyle}>
            <div>
              <h2 style={{ margin: 0, fontSize: "1.15rem" }}>
                Temporizador por defecto
              </h2>
              <p
                style={{
                  margin: "8px 0 0",
                  color: colors.textMuted,
                  fontSize: "0.95rem",
                }}
              >
                Perfil que se cargará al abrir la aplicación.
              </p>
            </div>
            <select
              value={perfilPorDefecto ?? ""}
              onChange={(e) => handlePerfilDefecto(parseInt(e.target.value))}
              style={{
                border: `1px solid ${colors.textMuted}`,
                borderRadius: "10px",
                background: colors.bgDark,
                color: colors.textPrimary,
                padding: "10px 14px",
                fontSize: "0.9rem",
                cursor: "pointer",
                minWidth: "220px",
              }}
            >
              {perfiles.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre} ({p.duracion} min · {p.ciclos} ciclo
                  {p.ciclos !== 1 ? "s" : ""})
                </option>
              ))}
            </select>
          </div>
        </section>

        {/* Eliminar cuenta */}
        <section style={{ ...sectionStyle, borderColor: "#c0392b" }}>
          <div style={rowStyle}>
            <div>
              <h2 style={{ margin: 0, fontSize: "1.15rem", color: "#e74c3c" }}>
                Eliminar cuenta
              </h2>
              <p
                style={{
                  margin: "8px 0 0",
                  color: colors.textMuted,
                  fontSize: "0.95rem",
                }}
              >
                Esta acción es permanente y no se puede deshacer.
              </p>
            </div>
            {!confirmarEliminar ? (
              <button
                type="button"
                onClick={() => setConfirmarEliminar(true)}
                style={{
                  minWidth: "160px",
                  padding: "12px 18px",
                  borderRadius: "999px",
                  border: "none",
                  cursor: "pointer",
                  background: "#e74c3c",
                  color: "#fff",
                  fontWeight: 700,
                }}
              >
                Eliminar cuenta
              </button>
            ) : (
              <div
                style={{ display: "flex", gap: "10px", alignItems: "center" }}
              >
                <span style={{ color: colors.textMuted, fontSize: "0.9rem" }}>
                  ¿Seguro?
                </span>
                <button
                  type="button"
                  onClick={handleEliminarCuenta}
                  style={{
                    padding: "10px 16px",
                    borderRadius: "999px",
                    border: "none",
                    cursor: "pointer",
                    background: "#e74c3c",
                    color: "#fff",
                    fontWeight: 700,
                  }}
                >
                  Sí, eliminar
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmarEliminar(false)}
                  style={{
                    padding: "10px 16px",
                    borderRadius: "999px",
                    border: `1px solid ${colors.textMuted}`,
                    cursor: "pointer",
                    background: "transparent",
                    color: colors.textPrimary,
                  }}
                >
                  No
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Settings;

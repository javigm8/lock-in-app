import { useTheme } from "../theme.jsx";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Sun, Moon } from 'lucide-react'

function Login() {
  const { colors, theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const canvasRef = useRef(null);

  const handleLogin = async (e) => {
    e?.preventDefault();
    setError("");
    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario, password }),
      });

      if (!response.ok) {
        setError("Usuario o contraseña incorrectos");
        return;
      }

      const data = await response.json();

      localStorage.setItem("token", data.token);

      localStorage.setItem(
        "usuario",
        JSON.stringify({
          id: data.id,
          nombre: data.nombre,
          usuario: data.usuario,
          email: data.email,
        }),
      );

      navigate("/dashboard");
    } catch (e) {
      setError("No se pudo conectar con el servidor", e);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const COUNT = 150;
    const particles = Array.from({ length: COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2.5 + 0.6,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      alpha: Math.random() * 0.4 + 0.1,
    }));

    let animId;

    const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const p of particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(127,175,130,${p.alpha})`;
      ctx.fill();
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;
    }

    animId = requestAnimationFrame(draw);
  };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: colors.bgDark,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      />

      <button
        onClick={toggleTheme}
        style={{
          position: "absolute",
          top: "20px",
          right: "24px",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          color: theme === 'dark' ? colors.textMuted : '#1C1E1A',
          zIndex: 10,
        }}
      >
        {theme === 'dark' ? <Sun /> : <Moon />}
      </button>

      <h1
        style={{
          color: colors.textPrimary,
          fontSize: "2rem",
          marginBottom: "2rem",
        }}
      >
        Lock <span style={{ color: colors.accentMain }}>In!</span>
      </h1>

      <form
        onSubmit={handleLogin}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          width: "300px",
        }}
      >
        <input
          type="text"
          placeholder="Email / Usuario"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
          style={{
            padding: "0.75rem 1rem",
            borderRadius: "8px",
            border: `1px solid ${colors.bgSurface}`,
            backgroundColor: colors.bgSurface,
            color: colors.textPrimary,
            fontSize: "0.95rem",
            outline: "none",
          }}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            padding: "0.75rem 1rem",
            borderRadius: "8px",
            border: `1px solid ${colors.bgSurface}`,
            backgroundColor: colors.bgSurface,
            color: colors.textPrimary,
            fontSize: "0.95rem",
            outline: "none",
          }}
        />

        {error && (
          <p
            style={{
              color: "#E07070",
              fontSize: "0.85rem",
              textAlign: "center",
              margin: 0,
            }}
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          style={{
            padding: "0.75rem",
            borderRadius: "8px",
            border: "none",
            backgroundColor: colors.accentMain,
            color: colors.textPrimary,
            fontSize: "0.95rem",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          Iniciar sesión
        </button>

        <p
          style={{
            color: colors.textMuted,
            fontSize: "0.85rem",
            textAlign: "center",
            margin: 0,
          }}
        >
          ¿Primera vez que usas Lock In?{" "}
          <span
            style={{ color: colors.accentMain, cursor: "pointer" }}
            onClick={() => navigate("/register")}
          >
            Crear una cuenta
          </span>
        </p>

        <p
          style={{
            color: colors.textMuted,
            fontSize: "0.85rem",
            textAlign: "center",
            margin: 0,
            opacity: 0.4,
          }}
        >
          ¿Has olvidado tu contraseña?
        </p>
      </form>
    </div>
  );
}

export default Login;

import { colors } from "../theme";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Login() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
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

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: colors.bgDark,
      }}
    >
      <h1
        style={{
          color: colors.textPrimary,
          fontSize: "2rem",
          marginBottom: "2rem",
        }}
      >
        Lock <span style={{ color: colors.accentMain }}>In!</span>
      </h1>

      <div
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
          onClick={handleLogin}
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
          ¿Has olvidado tu contraseña?
        </p>
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
      </div>
    </div>
  );
}

export default Login;

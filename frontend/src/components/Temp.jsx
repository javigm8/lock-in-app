import { useEffect, useState, useRef } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";
import "../styles/Temp.css";

const API_BASE = "http://localhost:8080";

function Temp({ usuario, running, setRunning, perfilActual }) {
  const [seconds, setSeconds] = useState(perfilActual ? perfilActual.duracion * 60 : 25 * 60);
  const [cicloActual, setCicloActual] = useState(1);
  const [sesionCompleta, setSesionCompleta] = useState(false);

  const fechaInicioRef = useRef(null);

  const token = () => localStorage.getItem("token");

  // Cuando el padre cambia el perfil, resetear el timer
  useEffect(() => {
    if (!perfilActual) return;
    setSeconds(perfilActual.duracion * 60);
    setRunning(false);
    setCicloActual(1);
    setSesionCompleta(false);
    fechaInicioRef.current = null;
  }, [perfilActual?.id]);


  // Guardar sesión en el backend
  const guardarSesion = async (ciclosCompletados) => {
    if (!usuario?.id || !perfilActual) return;
    const payload = {
      duracion: perfilActual.duracion,
      ciclosCompletos: ciclosCompletados,
      fechaInicio: fechaInicioRef.current,
      fechaCreacion: new Date().toISOString(),
      usuario: { id: usuario.id },
      perfilSesion: { id: perfilActual.id },
    };
    try {
      await fetch(`${API_BASE}/api/sesiones`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token()}`,
        },
        body: JSON.stringify(payload),
      });
    } catch (e) {
      console.error("Error guardando sesión", e);
    }
  };

  // Timer
  useEffect(() => {
    if (!running) return;

    const interval = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setRunning(false);

          const ciclosTotal = perfilActual?.ciclos ?? 1;
          const nuevoCiclo = cicloActual + 1;

          guardarSesion(cicloActual);

          if (cicloActual >= ciclosTotal) {
            setSesionCompleta(true);
            setCicloActual(1);
          } else {
            setCicloActual(nuevoCiclo);
          }

          return perfilActual ? perfilActual.duracion * 60 : 25 * 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [running, cicloActual, perfilActual]);

  const handlePlayPause = () => {
    if (sesionCompleta) return;
    if (!running && fechaInicioRef.current === null) {
      fechaInicioRef.current = new Date().toISOString();
    }
    setRunning((r) => !r);
  };

  const handleReset = () => {
    setRunning(false);
    setSeconds(perfilActual ? perfilActual.duracion * 60 : 25 * 60);
    setCicloActual(1);
    setSesionCompleta(false);
    fechaInicioRef.current = null;
  };

  const minutes = String(Math.floor(seconds / 60)).padStart(2, "0");
  const remainingSeconds = String(seconds % 60).padStart(2, "0");
  const timeLabel = `${minutes}:${remainingSeconds}`;

  const ciclosTotal = perfilActual?.ciclos ?? 1;
  const progress = perfilActual
    ? 1 - seconds / (perfilActual.duracion * 60)
    : 0;

  return (
    <div className="temp-root">
      <div className="temp-display">
        <div className="progress-ring-wrapper">
          <svg viewBox="0 0 120 120" className="progress-ring">
            <circle cx="60" cy="60" r="52" className="ring-bg" />
            <circle
              cx="60"
              cy="60"
              r="52"
              className="ring-fill"
              strokeDasharray={`${2 * Math.PI * 52}`}
              strokeDashoffset={`${2 * Math.PI * 52 * (1 - progress)}`}
            />
          </svg>
          <span className="temp-time">{timeLabel}</span>
        </div>
      </div>

      {sesionCompleta ? (
        <p className="sesion-completa">¡Sesión completada! 🎉</p>
      ) : (
        <p className="ciclo-label">
          Ciclo {cicloActual} de {ciclosTotal}
        </p>
      )}

      <div className="temp-controls">
        <button
          type="button"
          className="ctrl-btn"
          onClick={handlePlayPause}
          aria-label={running ? "Pausar" : "Iniciar"}
          disabled={sesionCompleta}
        >
          {running ? <Pause size={20} /> : <Play size={20} />}
        </button>
        <button
          type="button"
          className="ctrl-btn"
          onClick={handleReset}
          aria-label="Reiniciar"
        >
          <RotateCcw size={20} />
        </button>
      </div>
    </div>
  );
}

export default Temp;
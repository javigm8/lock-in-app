import { Play, Pause, RotateCcw } from "lucide-react";
import { useTimer } from "../TimerContext";
import "../styles/Temp.css";

function Temp() {
  const {
    perfilActual,
    seconds,
    running,
    cicloActual,
    sesionCompleta,
    handlePlayPause,
    handleReset,
  } = useTimer();

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

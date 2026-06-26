import { useEffect, useRef, useState } from "react";
import { Music, Music2 } from "lucide-react";
import "../styles/AmbientPlayer.css";

const BASE = window.location.protocol === "file:"
  ? "./sounds"
  : `${window.location.origin}/sounds`;

const SONIDOS = [
  { id: "lluvia", nombre: "Lluvia", icono: "🌧️", archivo: `${BASE}/lluvia.mp3` },
  { id: "olas", nombre: "Olas del mar", icono: "🌊", archivo: `${BASE}/olas.mp3` },
  { id: "bosque", nombre: "Bosque", icono: "🌳", archivo: `${BASE}/bosque.mp3` },
  { id: "blanco", nombre: "Ruido blanco", icono: "⚪", archivo: `${BASE}/blanco.mp3` },
];

function AmbientPlayer() {
  // Estado local del reproductor.
  const [abierto, setAbierto] = useState(false);
  const [sonidoActivo, setSonidoActivo] = useState(null);
  const [volumen, setVolumen] = useState(0.5);

  // Referencias para el audio y el popup.
  const audioRef = useRef(null);
  const popupRef = useRef(null);

  // Cierra el popup al hacer clic fuera.
  useEffect(() => {
    const handleClickFuera = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setAbierto(false);
      }
    };
    if (abierto) document.addEventListener("mousedown", handleClickFuera);
    return () => document.removeEventListener("mousedown", handleClickFuera);
  }, [abierto]);

  // Sincroniza el volumen con el audio activo.
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volumen;
    }
  }, [volumen]);

  // Alterna o cambia el sonido ambiental.
  const handleSonido = (sonido) => {
    if (sonidoActivo === sonido.id) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
      setSonidoActivo(null);
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    const audio = new Audio(sonido.archivo);
    audio.loop = true;
    audio.volume = volumen;
    audio.play();
    audioRef.current = audio;
    setSonidoActivo(sonido.id);
  };

  // Detiene la reproducción actual.
  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    setSonidoActivo(null);
  };

  const reproduciendo = sonidoActivo !== null;

  return (
    <div className="ambient-wrapper" ref={popupRef}>
      <button
        type="button"
        className={`nav-button ambient-btn ${reproduciendo ? "ambient-active" : ""}`}
        title="Sonido ambiental"
        aria-label="Sonido ambiental"
        onClick={() => setAbierto((a) => !a)}
      >
        {reproduciendo ? <Music2 size={22} /> : <Music size={22} />}
        {reproduciendo && <span className="ambient-dot" />}
      </button>

      {abierto && (
        <div className="ambient-popup">
          <p className="ambient-title">Sonido ambiental</p>
          <ul className="ambient-list">
            {SONIDOS.map((s) => (
              <li key={s.id}>
                <button
                  type="button"
                  className={`ambient-item ${sonidoActivo === s.id ? "activo" : ""}`}
                  onClick={() => handleSonido(s)}
                >
                  <span className="ambient-emoji">{s.icono}</span>
                  <span className="ambient-nombre">{ s.nombre }</span>
                  {sonidoActivo === s.id && (
                    <span className="ambient-playing">▶ sonando</span>
                  )}
                </button>
              </li>
            ))}
          </ul>

          <div className="ambient-volumen">
            <span>🔈</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volumen}
              onChange={(e) => setVolumen(parseFloat(e.target.value))}
              aria-label="Volumen"
            />
            <span>🔊</span>
          </div>

          {reproduciendo && (
            <button
              type="button"
              className="ambient-stop"
              onClick={handleStop}
            >
              Detener sonido
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default AmbientPlayer;

import { useEffect, useRef, useState } from "react";
import { Music, Music2 } from "lucide-react";
import "../styles/AmbientPlayer.css";

const BASE = window.location.protocol === "file:" 
  ? "./sounds"           // Electron (carga desde disco)
  : `${window.location.origin}/sounds`; // Navegador (Vite dev server)

const SONIDOS = [
  { id: "lluvia",    nombre: "Lluvia",       icono: "🌧️", archivo: `${BASE}/lluvia.mp3` },
  { id: "olas",      nombre: "Olas del mar", icono: "🌊", archivo: `${BASE}/olas.mp3` },
  { id: "bosque",    nombre: "Bosque",       icono: "🌲", archivo: `${BASE}/bosque.mp3` },
  { id: "blanco",    nombre: "Ruido blanco", icono: "📻", archivo: `${BASE}/blanco.mp3` },
];

function AmbientPlayer() {
  const [abierto, setAbierto] = useState(false);
  const [sonidoActivo, setSonidoActivo] = useState(null); // id del sonido activo
  const [volumen, setVolumen] = useState(0.5);

  const audioRef = useRef(null);
  const popupRef = useRef(null);

  // Cerrar popup al hacer click fuera
  useEffect(() => {
    const handleClickFuera = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setAbierto(false);
      }
    };
    if (abierto) document.addEventListener("mousedown", handleClickFuera);
    return () => document.removeEventListener("mousedown", handleClickFuera);
  }, [abierto]);

  // Cambiar volumen en tiempo real
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volumen;
    }
  }, [volumen]);

  const handleSonido = (sonido) => {
    // Si es el mismo sonido activo → parar
    if (sonidoActivo === sonido.id) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
      setSonidoActivo(null);
      return;
    }

    // Si había otro sonido → pararlo primero
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    // Reproducir el nuevo
    const audio = new Audio(sonido.archivo);
    audio.loop = true;
    audio.volume = volumen;
    audio.play();
    audioRef.current = audio;
    setSonidoActivo(sonido.id);
  };

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
        title="Ambiente sonoro"
        aria-label="Ambiente sonoro"
        onClick={() => setAbierto((a) => !a)}
      >
        {reproduciendo ? <Music2 size={22} /> : <Music size={22} />}
        {reproduciendo && <span className="ambient-dot" />}
      </button>

      {abierto && (
        <div className="ambient-popup">
          <p className="ambient-title">Ambiente sonoro</p>

          <ul className="ambient-list">
            {SONIDOS.map((s) => (
              <li key={s.id}>
                <button
                  type="button"
                  className={`ambient-item ${sonidoActivo === s.id ? "activo" : ""}`}
                  onClick={() => handleSonido(s)}
                >
                  <span className="ambient-emoji">{s.icono}</span>
                  <span className="ambient-nombre">{s.nombre}</span>
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

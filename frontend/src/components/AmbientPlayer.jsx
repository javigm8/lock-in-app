import { useEffect, useRef, useState } from "react";
import { Music, Music2 } from "lucide-react";
import "../styles/AmbientPlayer.css";

const BASE = window.location.protocol === "file:" 
  ? "./sounds"           // Electron (carga desde disco)
  : `${window.location.origin}/sounds`; // Navegador (Vite dev server)

const SONIDOS = [
  { id: "lluvia",    nombre: "Lluvia",       icono: "🌧️", archivo: `${BASE}/lluvia.mp3` },
  { id: "olas",      nombre: "Olas del mar", icono: "🌊", archivo: `${BASE}/olas.mp3` },
  { id: "bosque",    nombre: "Bosque",       icono: "🌳", archivo: `${BASE}/bosque.mp3` },
  { id: "blanco",    nombre: "Ruido blanco", icono: "📻", archivo: `${BASE}/blanco.mp3` },
];

function AmbientPlayer() {
  // Controla si el panel flotante está visible.
  const [abierto, setAbierto] = useState(false);
  // Guarda el id del sonido que se está reproduciendo actualmente.
  const [sonidoActivo, setSonidoActivo] = useState(null);
  // Volumen global aplicado al audio actual y a los siguientes audios.
  const [volumen, setVolumen] = useState(0.5);

  // Referencia al objeto Audio en reproducción.
  const audioRef = useRef(null);
  // Referencia al contenedor para detectar clics fuera del popup.
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
    // Si se pulsa el mismo sonido que ya está activo, actúa como toggle (detener).
    if (sonidoActivo === sonido.id) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
      setSonidoActivo(null);
      return;
    }

    // Si había otro sonido sonando, lo detenemos antes de cambiar.
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    // Crea una nueva instancia de audio y la reproduce en bucle.
    const audio = new Audio(sonido.archivo);
    audio.loop = true;
    audio.volume = volumen;
    audio.play();
    audioRef.current = audio;
    setSonidoActivo(sonido.id);
  };

  const handleStop = () => {
    // Botón de parada total: limpia reproducción y estado visual.
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
      {/* Botón principal del reproductor en la barra de navegación. */}
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

          {/* Lista de sonidos disponibles con indicador del activo. */}
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

          {/* Control de volumen en tiempo real (0 a 1). */}
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

          {/* Solo se muestra cuando hay un sonido en reproducción. */}
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

import { createContext, useContext, useEffect, useRef, useState } from "react";

const TimerContext = createContext(null);

const BASE = window.location.protocol === "file:"
  ? "./sounds"
  : `${window.location.origin}/sounds`;

export function TimerProvider({ children }) {
  const [perfiles, setPerfiles] = useState([]);
  const [perfilActual, setPerfilActual] = useState(null);
  const [seconds, setSeconds] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [cicloActual, setCicloActual] = useState(1);
  const [sesionCompleta, setSesionCompleta] = useState(false);
  const fechaInicioRef = useRef(null);
  const audioCiclo = useRef(new Audio(`${BASE}/ciclo_completado.mp3`));
  const audioSesion = useRef(new Audio(`${BASE}/sesion_completada.mp3`));

  const usuario = () => JSON.parse(localStorage.getItem("usuario"));
  const token = () => localStorage.getItem("token");

  const cargarPerfiles = () => {
    const u = usuario();
    const t = token();
    if (!u || !t) return;
    Promise.all([
      fetch("http://localhost:8080/api/perfiles-sesion/predefinidos", {
        headers: { Authorization: `Bearer ${t}` },
      }).then((r) => r.json()),
      fetch(`http://localhost:8080/api/perfiles-sesion/usuario/${u.id}`, {
        headers: { Authorization: `Bearer ${t}` },
      }).then((r) => r.json()),
    ])
      .then(([predefinidos, custom]) => {
        const todos = [...predefinidos, ...custom.filter((p) => p.esCustom)];
        setPerfiles(todos);
        if (todos.length > 0) {
          const config = u.configuracion ? JSON.parse(u.configuracion) : {};
          const porDefecto = todos.find((p) => p.id === config.perfilPorDefecto);
          setPerfilActual((prev) => prev ?? porDefecto ?? todos[0]);
        }
      })
      .catch(console.error);
  };

  useEffect(() => {
    cargarPerfiles();
  }, []);

  // Resetear timer cuando cambia el perfil
  useEffect(() => {
    if (!perfilActual) return;
    setSeconds(perfilActual.duracion * 60);
    setRunning(false);
    setCicloActual(1);
    setSesionCompleta(false);
    fechaInicioRef.current = null;
  }, [perfilActual?.id]);

  const guardarSesion = async (ciclosCompletados) => {
    const u = usuario();
    if (!u?.id || !perfilActual) return;
    const payload = {
      duracion: perfilActual.duracion,
      ciclosCompletos: ciclosCompletados,
      fechaInicio: fechaInicioRef.current,
      fechaCreacion: new Date().toISOString(),
      usuario: { id: u.id },
      perfilSesion: { id: perfilActual.id },
    };
    try {
      await fetch("http://localhost:8080/api/sesiones", {
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

  // Intervalo del timer
  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setRunning(false);

          const ciclosTotal = perfilActual?.ciclos ?? 1;
          guardarSesion(cicloActual);

          // Notificación si está activada
          const u = usuario();
          const config = u?.configuracion ? JSON.parse(u.configuracion) : {};
          if (config.notificaciones && Notification.permission === "granted") {
            new Notification("¡Ciclo completado! 🎉", {
              body: `Has completado el ciclo ${cicloActual} de ${ciclosTotal}.`,
            });
          }

          if (cicloActual >= ciclosTotal) {
            audioSesion.current.play().catch(console.error);
            setSesionCompleta(true);
            setCicloActual(1);
          } else {
            audioCiclo.current.play().catch(console.error);
            setCicloActual((c) => c + 1);
          }

          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [running, cicloActual, perfilActual]);

  const handlePlayPause = () => {
    if (sesionCompleta) return;
    if (!running) {
      if (seconds === 0) {
        setSeconds(perfilActual ? perfilActual.duracion * 60 : 25 * 60);
      }
      if (fechaInicioRef.current === null) {
        fechaInicioRef.current = new Date().toISOString();
      }
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

  return (
    <TimerContext.Provider value={{
      perfiles,
      perfilActual,
      setPerfilActual,
      seconds,
      running,
      setRunning,
      cicloActual,
      sesionCompleta,
      handlePlayPause,
      handleReset,
      cargarPerfiles,
    }}>
      {children}
    </TimerContext.Provider>
  );
}

export function useTimer() {
  return useContext(TimerContext);
}
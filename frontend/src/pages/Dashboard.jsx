import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home,
  ClipboardList,
  Timer,
  StickyNote,
  LayoutDashboard,
  BarChart2,
  Settings,
  LogOut,
  User,
  Plus,
  Trash2,
  Check,
  Play,
  Pause,
  RotateCcw,
} from "lucide-react";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [tasksError, setTasksError] = useState("");

  const [newTask, setNewTask] = useState("");

  const [usuarioActual] = useState(() => {
    const usuarioGuardado = localStorage.getItem("usuario");
    return usuarioGuardado ? JSON.parse(usuarioGuardado) : null;
  });

  const [notes, setNotes] = useState(() => {
    return localStorage.getItem("lockin_notes") || "";
  });

  const [seconds, setSeconds] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [sessionCount, setSessionCount] = useState(3);

  useEffect(() => {
    const cargarTareas = async () => {
      if (!usuarioActual?.id) {
        setTasksError("No se pudo identificar al usuario");
        setLoadingTasks(false);
        return;
      }

      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          `http://localhost:8080/api/tareas/usuario/${usuarioActual.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error("No se pudieron cargar las tareas");
        }

        const data = await response.json();

        setTasks(
          data.map((tarea) => ({
            id: tarea.id,
            text: tarea.titulo,
            done: tarea.estado === "COMPLETADA",
            descripcion: tarea.descripcion,
            prioridad: tarea.prioridad,
            tiempoEstimado: tarea.tiempoEstimado,
            tiempoReal: tarea.tiempoReal,
            fechaCreacion: tarea.fechaCreacion,
            fechaLimite: tarea.fechaLimite,
          })),
        );
      } catch (error) {
        console.error(error);
        setTasksError("No se pudieron cargar las tareas");
      } finally {
        setLoadingTasks(false);
      }
    };

    cargarTareas();
  }, [usuarioActual?.id]);

  useEffect(() => {
    localStorage.setItem("lockin_notes", notes);
  }, [notes]);

  useEffect(() => {
    if (!running) {
      return;
    }

    const timer = setInterval(() => {
      setSeconds((currentSeconds) => {
        if (currentSeconds <= 1) {
          clearInterval(timer);
          setRunning(false);
          setSessionCount((currentCount) => currentCount + 1);
          return 25 * 60;
        }
        return currentSeconds - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [running]);

  const completed = tasks.filter((task) => task.done).length;

  const progress = tasks.length
    ? Math.round((completed / tasks.length) * 100)
    : 0;

  const timeLabel = useMemo(() => {
    const minutes = String(Math.floor(seconds / 60)).padStart(2, "0");
    const remainingSeconds = String(seconds % 60).padStart(2, "0");
    return `${minutes}:${remainingSeconds}`;
  }, [seconds]);

  const addTask = async (event) => {
    event.preventDefault();

    const text = newTask.trim();
    if (!text || !usuarioActual?.id) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:8080/api/tareas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          titulo: text,
          descripcion: "",
          estado: "PENDIENTE",
          prioridad: 2,
          tiempoEstimado: null,
          tiempoReal: null,
          fechaLimite: null,
          fechaCreacion: new Date().toISOString(),
          usuario: {
            id: usuarioActual.id,
          },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "No se pudo crear la tarea");
      }

      const nuevaTarea = await response.json();

      setTasks((currentTasks) => [
        ...currentTasks,
        {
          id: nuevaTarea.id,
          text: nuevaTarea.titulo,
          done: nuevaTarea.estado === "COMPLETADA",
          descripcion: nuevaTarea.descripcion,
          prioridad: nuevaTarea.prioridad,
          tiempoEstimado: nuevaTarea.tiempoEstimado,
          tiempoReal: nuevaTarea.tiempoReal,
          fechaCreacion: nuevaTarea.fechaCreacion,
          fechaLimite: nuevaTarea.fechaLimite,
        },
      ]);

      setNewTask("");
    } catch (error) {
      console.error("Error creando la tarea:", error);
      setTasksError("No se pudo guardar la tarea");
    }
  };

  const toggleTask = (taskId) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId ? { ...task, done: !task.done } : task,
      ),
    );
  };

  const deleteTask = (taskId) => {
    setTasks((currentTasks) =>
      currentTasks.filter((task) => task.id !== taskId),
    );
  };

  const resetTimer = () => {
    setRunning(false);
    setSeconds(25 * 60);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    navigate("/");
  };

  const navItems = [
    { icon: <Home size={22} />, label: "Inicio", active: true },
    { icon: <ClipboardList size={22} />, label: "Tareas" },
    { icon: <Timer size={22} />, label: "Temporizador" },
    { icon: <StickyNote size={22} />, label: "Notas" },
    { icon: <LayoutDashboard size={22} />, label: "Pizarra" },
    { icon: <BarChart2 size={22} />, label: "Estadísticas" },
  ];

  return (
    <div className="dashboard-shell">
      <aside className="sidebar" aria-label="Navegación principal">
        <button className="brand-mark" type="button" aria-label="Inicio">
          <span>L</span>
        </button>

        <nav className="sidebar-nav">
          {navItems.map(({ icon, label, active }) => (
            <button
              key={label}
              type="button"
              className={`nav-button ${active ? "active" : ""}`}
              title={label}
              aria-label={label}
            >
              {icon}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <button
            className="nav-button"
            type="button"
            title="Ajustes"
            aria-label="Ajustes"
          >
            <Settings size={22} />
          </button>

          <button
            className="nav-button logout-button"
            type="button"
            title="Cerrar sesión"
            aria-label="Cerrar sesión"
            onClick={logout}
          >
            <LogOut size={22} />
          </button>
        </div>
      </aside>

      <main className="dashboard-main">
        <header className="topbar">
          <div>
            <p className="eyebrow">Panel principal</p>
            <h1>
              Lock <span>In!</span>
            </h1>
          </div>

          <div className="topbar-center">
            <span className={`focus-dot ${running ? "running" : ""}`} />
            <strong>
              {running ? "Sesión en curso" : "Listo para concentrarte"}
            </strong>
          </div>

          <button className="profile-button" type="button">
            <div className="profile-copy">
              <strong>¡Hola, {usuarioActual?.nombre || "Usuario"}!</strong>
              <span>Modo concentración</span>
            </div>
            <span className="avatar">
              <User size={20} />
            </span>
          </button>
        </header>

        <section className="dashboard-grid">
          <article className="panel tasks-panel">
            <div className="panel-heading">
              <div>
                <span className="panel-kicker">Organización</span>
                <h2>Tareas</h2>
              </div>
              <span className="panel-badge">
                {completed}/{tasks.length}
              </span>
            </div>

            <form className="task-form" onSubmit={addTask}>
              <input
                type="text"
                value={newTask}
                onChange={(event) => setNewTask(event.target.value)}
                placeholder="Añadir una nueva tarea..."
                aria-label="Nueva tarea"
              />
              <button type="submit" aria-label="Añadir tarea">
                <Plus size={19} />
              </button>
            </form>

            <div className="task-list">
              {loadingTasks && (
                <p className="empty-state">Cargando tareas...</p>
              )}
              {!loadingTasks && tasks.length === 0 && (
                <p className="empty-state">No tienes tareas guardadas.</p>
              )}
              {tasksError && <p className="empty-state">{tasksError}</p>}

              {tasks.map((task) => (
                <div
                  className={`task-item ${task.done ? "done" : ""}`}
                  key={task.id}
                >
                  <button
                    className="task-check"
                    type="button"
                    onClick={() => toggleTask(task.id)}
                    aria-label={
                      task.done ? "Marcar como pendiente" : "Completar tarea"
                    }
                  >
                    {task.done && <Check size={15} />}
                  </button>

                  <span>{task.text}</span>

                  <button
                    className="task-delete"
                    type="button"
                    onClick={() => deleteTask(task.id)}
                    aria-label="Eliminar tarea"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              ))}
            </div>
          </article>

          <article className="panel timer-panel">
            <div className="panel-heading">
              <div>
                <span className="panel-kicker">Pomodoro</span>
                <h2>Temporizador</h2>
              </div>
              <span className="panel-badge">25 min</span>
            </div>

            <div
              className="timer-ring"
              style={{
                "--timer-progress": `${(seconds / (25 * 60)) * 360}deg`,
              }}
            >
              <div className="timer-inner">
                <span>{timeLabel}</span>
                <small>
                  {running ? "Mantén el foco" : "Sesión de trabajo"}
                </small>
              </div>
            </div>

            <div className="timer-controls">
              <button
                className="primary-control"
                type="button"
                onClick={() => setRunning(!running)}
              >
                {running ? <Pause size={18} /> : <Play size={18} />}
                {running ? "Pausar" : "Comenzar"}
              </button>

              <button
                className="secondary-control"
                type="button"
                onClick={resetTimer}
                aria-label="Reiniciar temporizador"
              >
                <RotateCcw size={18} />
              </button>
            </div>
          </article>

          <article className="panel notes-panel">
            <div className="panel-heading">
              <div>
                <span className="panel-kicker">Apuntes rápidos</span>
                <h2>Notas</h2>
              </div>
              <span className="autosave">Guardado automático</span>
            </div>

            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Escribe aquí ideas, recordatorios o cualquier cosa que no quieras olvidar..."
            />

            <div className="note-footer">
              <span>{notes.length} caracteres</span>
              <span>Se guarda en este dispositivo</span>
            </div>
          </article>

          <article className="panel stats-panel">
            <div className="panel-heading">
              <div>
                <span className="panel-kicker">Tu progreso</span>
                <h2>Estadísticas</h2>
              </div>
              <span className="panel-badge">Hoy</span>
            </div>

            <div className="stats-content">
              <div className="stat-card">
                <span className="stat-label">Sesiones completadas</span>
                <strong>{sessionCount}</strong>
                <small>+1 respecto a ayer</small>
              </div>

              <div className="stat-card">
                <span className="stat-label">Tareas completadas</span>
                <strong>{completed}</strong>
                <small>de {tasks.length} tareas</small>
              </div>

              <div className="stat-card">
                <span className="stat-label">Tiempo concentrado</span>
                <strong>
                  {sessionCount * 25}
                  <em> min</em>
                </strong>
                <small>Objetivo diario: 100 min</small>
              </div>

              <div className="progress-card">
                <div className="progress-copy">
                  <span>Progreso de tareas</span>
                  <strong>{progress}%</strong>
                </div>
                <div className="progress-track">
                  <div style={{ width: `${progress}%` }} />
                </div>
                <div className="week-bars" aria-label="Actividad semanal">
                  {[42, 64, 35, 82, 58, 91, 70].map((height, index) => (
                    <div key={index}>
                      <span style={{ height: `${height}%` }} />
                      <small>
                        {["L", "M", "X", "J", "V", "S", "D"][index]}
                      </small>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </article>

          <article className="panel board-panel">
            <div className="panel-heading">
              <div>
                <span className="panel-kicker">Espacio visual</span>
                <h2>Pizarra</h2>
              </div>
              <button className="clear-board" type="button">
                Limpiar
              </button>
            </div>

            <div className="board-area">
              <div
                className="sticky-note green"
                contentEditable
                suppressContentEditableWarning
              >
                Idea principal
              </div>
              <div
                className="sticky-note cream"
                contentEditable
                suppressContentEditableWarning
              >
                Próximo objetivo
              </div>
              <div className="board-placeholder">
                <Plus size={20} />
                <span>Añade y edita tus notas visuales</span>
              </div>
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;

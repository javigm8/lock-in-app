import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const Icon = ({ name, size = 22 }) => {
  const paths = {
    home: (
      <>
        <path d="M3 10.5 12 3l9 7.5" />
        <path d="M5 9.5V21h14V9.5" />
        <path d="M9 21v-7h6v7" />
      </>
    ),
    tasks: (
      <>
        <rect x="5" y="3" width="14" height="18" rx="2" />
        <path d="M9 3.5h6" />
        <path d="m8 10 1.5 1.5L12 9" />
        <path d="M14 10h3" />
        <path d="m8 15 1.5 1.5L12 14" />
        <path d="M14 15h3" />
      </>
    ),
    timer: (
      <>
        <circle cx="12" cy="13" r="8" />
        <path d="M12 9v4l3 2" />
        <path d="M9 2h6" />
        <path d="M12 2v3" />
      </>
    ),
    notes: (
      <>
        <path d="M5 3h14v18H5z" />
        <path d="M8 7h8M8 11h8M8 15h5" />
      </>
    ),
    board: (
      <>
        <path d="M4 4h16v14H4z" />
        <path d="M8 22h8M12 18v4" />
      </>
    ),
    stats: (
      <>
        <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
      </>
    ),
    settings: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.12 2.12-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.03 1.55V21h-3v-.09A1.7 1.7 0 0 0 10.68 19a1.7 1.7 0 0 0-1.88.34l-.06.06-2.12-2.12.06-.06A1.7 1.7 0 0 0 7 15.34a1.7 1.7 0 0 0-1.55-1.03H5v-3h.45A1.7 1.7 0 0 0 7 10.28a1.7 1.7 0 0 0-.34-1.88l-.06-.06 2.12-2.12.06.06A1.7 1.7 0 0 0 10.66 6a1.7 1.7 0 0 0 1.03-1.55V4h3v.45A1.7 1.7 0 0 0 15.72 6a1.7 1.7 0 0 0 1.88-.34l.06-.06 2.12 2.12-.06.06a1.7 1.7 0 0 0-.34 1.88 1.7 1.7 0 0 0 1.55 1.03H21v3h-.09A1.7 1.7 0 0 0 19.4 15Z" />
      </>
    ),
    user: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21a8 8 0 0 1 16 0" />
      </>
    ),
    logout: (
      <>
        <path d="M10 17l5-5-5-5" />
        <path d="M15 12H3" />
        <path d="M14 3h7v18h-7" />
      </>
    ),
    plus: (
      <>
        <path d="M12 5v14M5 12h14" />
      </>
    ),
    trash: (
      <>
        <path d="M4 7h16M9 7V4h6v3M7 7l1 14h8l1-14" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    play: <path d="m8 5 11 7-11 7Z" />,
    pause: (
      <>
        <path d="M9 5v14M15 5v14" />
      </>
    ),
    reset: (
      <>
        <path d="M4 12a8 8 0 1 0 2.34-5.66L4 8" />
        <path d="M4 3v5h5" />
      </>
    ),
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
};

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

  return (
    <div className="dashboard-shell">
      <aside className="sidebar" aria-label="Navegación principal">
        <button className="brand-mark" type="button" aria-label="Inicio">
          <span>L</span>
        </button>

        <nav className="sidebar-nav">
          {[
            ["home", "Inicio", true],
            ["tasks", "Tareas", false],
            ["timer", "Temporizador", false],
            ["notes", "Notas", false],
            ["board", "Pizarra", false],
            ["stats", "Estadísticas", false],
          ].map(([icon, label, active]) => (
            <button
              key={label}
              type="button"
              className={`nav-button ${active ? "active" : ""}`}
              title={label}
              aria-label={label}
            >
              <Icon name={icon} />
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
            <Icon name="settings" />
          </button>

          <button
            className="nav-button logout-button"
            type="button"
            title="Cerrar sesión"
            aria-label="Cerrar sesión"
            onClick={logout}
          >
            <Icon name="logout" />
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
              <Icon name="user" size={20} />
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
                <Icon name="plus" size={19} />
              </button>
            </form>

            <div className="task-list">
              {tasks.length === 0 && (
                <p className="empty-state">No tienes tareas guardadas.</p>
              )}
              {loadingTasks && (
                <p className="empty-state">Cargando tareas...</p>
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
                    {task.done && <Icon name="check" size={15} />}
                  </button>

                  <span>{task.text}</span>

                  <button
                    className="task-delete"
                    type="button"
                    onClick={() => deleteTask(task.id)}
                    aria-label="Eliminar tarea"
                  >
                    <Icon name="trash" size={17} />
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
                <Icon name={running ? "pause" : "play"} size={18} />

                {running ? "Pausar" : "Comenzar"}
              </button>

              <button
                className="secondary-control"
                type="button"
                onClick={resetTimer}
                aria-label="Reiniciar temporizador"
              >
                <Icon name="reset" size={18} />
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
                  <div
                    style={{
                      width: `${progress}%`,
                    }}
                  />
                </div>

                <div className="week-bars" aria-label="Actividad semanal">
                  {[42, 64, 35, 82, 58, 91, 70].map((height, index) => (
                    <div key={index}>
                      <span
                        style={{
                          height: `${height}%`,
                        }}
                      />

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
                <Icon name="plus" size={20} />

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

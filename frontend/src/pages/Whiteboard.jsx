import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Pencil, Eraser, Trash2, Download, Pipette } from "lucide-react";
import "../styles/Whiteboard.css";

// Paleta de colores para dibujar
const COLORS = [
  "#F5F3EE",
  "#7FAF82",
  "#E57373",
  "#FFB74D",
  "#FFF176",
  "#64B5F6",
  "#CE93D8",
];

// Tamaños de pincel disponibles
const SIZES = [3, 6, 12, 20];

function Whiteboard() {
  const navigate = useNavigate();
  // Referencias para canvas y estado de dibujo
  const canvasRef = useRef(null);
  const isDrawing = useRef(false);
  const lastPoint = useRef(null);
  const pizarraId = useRef(null);
  const cargado = useRef(false);

  // Herramientas disponibles: pincel, borrador, cuentagotas
  const [tool, setTool] = useState("pencil");
  const [color, setColor] = useState(COLORS[0]);
  const [size, setSize] = useState(SIZES[1]);
  const [eyeDropperColor, setEyeDropperColor] = useState("#F5F3EE");

  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Inicializa fondo oscuro
    context.fillStyle = "#1C1E1A";
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Carga pizarra guardada si existe
    fetch(`http://localhost:8080/api/pizarras/usuario/${usuario.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.length > 0) {
          const pizarra = data[0];
          pizarraId.current = pizarra.id;
          const datosParseados = pizarra.datos ? JSON.parse(pizarra.datos) : null;
          if (datosParseados?.imagen) {
            const img = new Image();
            img.onload = () => {
              context.drawImage(img, 0, 0);
              cargado.current = true;
            };
            img.src = datosParseados.imagen;
          } else {
            cargado.current = true;
          }
        } else {
          cargado.current = true; // Canvas vacío, listo para guardar
        }
      })
      .catch(console.error);
  }, []);

  // Guarda pizarra en backend y regresa
  const handleBack = async () => {
    const canvas = canvasRef.current;
    if (!canvas || !cargado.current) return;

    const imagen = canvas.toDataURL("image/png");
    const body = {
      ...(pizarraId.current ? { id: pizarraId.current } : {}),
      usuario: { id: usuario.id },
      titulo: "Mi pizarra",
      version: "1",
      datos: JSON.stringify({ imagen }),
    };

    await fetch("http://localhost:8080/api/pizarras", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    }).catch(console.error);

    navigate("/dashboard");
  };

  // Selecciona color con cuentagotas del navegador
  const handleEyeDropper = async () => {
    if (!window.EyeDropper) return;
    const eyeDropper = new EyeDropper();
    const result = await eyeDropper.open();
    setEyeDropperColor(result.sRGBHex);
    setColor(result.sRGBHex);
    setTool("pencil");
  };

  // Convierte coordenadas del mouse a coordenadas del canvas
  const getPosition = (e, canvas) => {
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (canvas.width / rect.width),
      y: (e.clientY - rect.top) * (canvas.height / rect.height),
    };
  };

  // Inicia trazo
  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    isDrawing.current = true;
    lastPoint.current = getPosition(e, canvas);
  };

  // Dibuja línea según posición actual
  const draw = (e) => {
    if (!isDrawing.current) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const current = getPosition(e, canvas);

    context.beginPath();
    context.lineCap = "round";
    context.lineJoin = "round";

    if (tool === "eraser") {
      context.globalCompositeOperation = "source-over";
      context.strokeStyle = "#1C1E1A";
      context.lineWidth = size * 3;
    } else {
      context.globalCompositeOperation = "source-over";
      context.strokeStyle = color;
      context.lineWidth = size;
    }

    context.moveTo(lastPoint.current.x, lastPoint.current.y);
    context.lineTo(current.x, current.y);
    context.stroke();

    lastPoint.current = current;
  };

  // Finaliza trazo
  const stopDrawing = () => {
    isDrawing.current = false;
    lastPoint.current = null;
  };

  // Limpia canvas
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.globalCompositeOperation = "source-over";
    context.fillStyle = "#1C1E1A";
    context.fillRect(0, 0, canvas.width, canvas.height);
  };

  // Descarga canvas como imagen PNG
  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    const link = document.createElement("a");
    link.download = "pizarra-lockin.png";
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="whiteboard-shell">
      <header className="whiteboard-topbar">
        <button className="wb-back-btn" onClick={handleBack} title="Volver">
          <ArrowLeft size={20} />
          <span>Dashboard</span>
        </button>

        <h1 className="wb-title">
          Lock <span>In!</span> · Pizarra
        </h1>

        <div className="wb-actions">
          <button className="wb-icon-btn" onClick={downloadCanvas} title="Descargar">
            <Download size={18} />
          </button>
          <button className="wb-icon-btn danger" onClick={clearCanvas} title="Limpiar todo">
            <Trash2 size={18} />
          </button>
        </div>
      </header>

      <div className="whiteboard-body">
        {/* Barra lateral con herramientas: pincel, colores, tamaño */}
        <aside className="wb-toolbar">
          <div className="wb-section">
            <button
              className={`wb-tool-btn ${tool === "pencil" ? "active" : ""}`}
              onClick={() => setTool("pencil")}
              title="Lápiz"
            >
              <Pencil size={20} />
            </button>
            <button
              className={`wb-tool-btn ${tool === "eraser" ? "active" : ""}`}
              onClick={() => setTool("eraser")}
              title="Borrador"
            >
              <Eraser size={20} />
            </button>
          </div>

          <div className="wb-divider" />

          <div className="wb-section wb-colors">
            {COLORS.map((c) => (
              <button
                key={c}
                className={`wb-color-btn ${color === c && tool === "pencil" ? "active" : ""}`}
                style={{ background: c }}
                onClick={() => { setColor(c); setTool("pencil"); }}
                title={c}
              />
            ))}
            <button
              className="wb-color-btn eyedropper-btn"
              onClick={handleEyeDropper}
              title="Cuentagotas"
              style={{ background: eyeDropperColor }}
            >
              <Pipette size={14} />
            </button>
          </div>

          <div className="wb-divider" />

          <div className="wb-section wb-sizes">
            {SIZES.map((s) => (
              <button
                key={s}
                className={`wb-size-btn ${size === s ? "active" : ""}`}
                onClick={() => setSize(s)}
                title={`${s}px`}
              >
                <span style={{ width: s, height: s }} />
              </button>
            ))}
          </div>
        </aside>

        {/* Canvas para dibujar */}
        <canvas
          ref={canvasRef}
          className="wb-canvas"
          style={{ cursor: tool === "eraser" ? "cell" : "crosshair" }}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />
      </div>
    </div>
  );
}

export default Whiteboard;
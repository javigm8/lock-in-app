import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Pencil, Eraser, Trash2, Download } from "lucide-react";
import "../styles/Whiteboard.css";

const COLORS = [
  "#F5F3EE",
  "#1C1E1A",
  "#7FAF82",
  "#E57373",
  "#FFB74D",
  "#FFF176",
  "#64B5F6",
  "#CE93D8",
];

const SIZES = [3, 6, 12, 20];

function Whiteboard() {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const isDrawing = useRef(false);
  const lastPoint = useRef(null);
  const pizarraId = useRef(null);

  const [tool, setTool] = useState("pencil");
  const [color, setColor] = useState(COLORS[0]);
  const [size, setSize] = useState(SIZES[1]);

  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    context.fillStyle = "#1C1E1A";
    context.fillRect(0, 0, canvas.width, canvas.height);

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
            img.onload = () => context.drawImage(img, 0, 0);
            img.src = datosParseados.imagen;
          }
        }
      })
      .catch(console.error);
  }, []);

  const handleBack = async () => {
    const c = canvasRef.current;
    if (!c) return;
    const imagen = c.toDataURL("image/png");
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

  const getPosition = (e, canvas) => {
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (canvas.width / rect.width),
      y: (e.clientY - rect.top) * (canvas.height / rect.height),
    };
  };

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    isDrawing.current = true;
    lastPoint.current = getPosition(e, canvas);
  };

  const draw = (e) => {
    if (!isDrawing.current) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const current = getPosition(e, canvas);

    context.beginPath();
    context.lineCap = "round";
    context.lineJoin = "round";

    if (tool === "eraser") {
      context.globalCompositeOperation = "destination-out";
      context.strokeStyle = "rgba(0,0,0,1)";
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

  const stopDrawing = () => {
    isDrawing.current = false;
    lastPoint.current = null;
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.globalCompositeOperation = "source-over";
    context.fillStyle = "#1C1E1A";
    context.fillRect(0, 0, canvas.width, canvas.height);
  };

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
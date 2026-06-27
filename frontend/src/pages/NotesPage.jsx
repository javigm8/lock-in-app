import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Shrink } from "lucide-react";
import Notes from "../components/Notes";

function NotesPage() {
  const navigate = useNavigate();
  const [usuario] = useState(() => JSON.parse(localStorage.getItem("usuario")));

  return (
    <>
      <header className="topbar">
        <div>
          <span className="panel-kicker">Apuntes rápidos</span>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em" }}>Notas</h2>
        </div>
        <div />
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button className="nav-button" onClick={() => navigate("/dashboard")} title="Volver al dashboard">
            <Shrink size={20} />
          </button>
        </div>
      </header>
      <div style={{ padding: "24px 0" }}>
        <Notes usuario={usuario} />
      </div>
    </>
  );
}

export default NotesPage;
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Shrink } from "lucide-react";
import Statistics from "../components/Statistics";

function StatisticsPage() {
  const navigate = useNavigate();
  const [usuario] = useState(() => JSON.parse(localStorage.getItem("usuario")));

  return (
    <>
      <header className="topbar">
        <div>
          <span className="panel-kicker">Tu progreso</span>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em" }}>Estadísticas</h2>
        </div>
        <div />
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button className="nav-button" onClick={() => navigate("/dashboard")} title="Volver al dashboard">
            <Shrink size={20} />
          </button>
        </div>
      </header>
      <div style={{ padding: "24px 0" }}>
        <Statistics usuario={usuario} />
      </div>
    </>
  );
}

export default StatisticsPage;
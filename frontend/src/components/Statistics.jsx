import { useEffect, useState, memo } from "react";
import { Chart, XAxis, YAxis, Tooltip } from "@highcharts/react";
import { ColumnSeries } from "@highcharts/react/series/Column";
import { AreaSeries } from "@highcharts/react/series/Area";
import { PieSeries } from "@highcharts/react/series/Pie";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTheme } from "../theme";
import "../styles/Statistics.css";

const DIAS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
const ACCENT = "#7FAF82";

function getInicioSemana() {
  const hoy = new Date();
  const dia = hoy.getDay();
  const diff = dia === 0 ? 6 : dia - 1;
  const lunes = new Date(hoy);
  lunes.setHours(0, 0, 0, 0);
  lunes.setDate(hoy.getDate() - diff);
  return lunes;
}

function getInicioSemanaOffset(offset) {
  const lunes = getInicioSemana();
  lunes.setDate(lunes.getDate() - offset * 7);
  return lunes;
}

function formatMinutes(minutos) {
  const h = Math.floor(minutos / 60);
  const m = minutos % 60;
  return h > 0 ? `${h}h ${m}min` : `${m} min`;
}

function formatSessionCount(cantidad) {
  return `${cantidad} sesión${cantidad !== 1 ? "es" : ""}`;
}

function Statistics({ usuario, carousel = true }) {
  const { colors } = useTheme();

  const [minutosPorDia, setMinutosPorDia] = useState(Array(7).fill(0));
  const [sesionesPorDia, setSesionesPorDia] = useState(Array(7).fill(0));
  const [minutosPorSemana, setMinutosPorSemana] = useState(Array(4).fill(0));
  const [cargando, setCargando] = useState(true);
  const [slide, setSlide] = useState(0);

  const SLIDES = [
    "Tiempo de focus semanal",
    "Sesiones por día esta semana",
    "Total acumulado · últimas 4 semanas",
  ];

  useEffect(() => {
    if (!usuario) return;
    const token = localStorage.getItem("token");
    const lunes = getInicioSemana();

    fetch(`http://localhost:8080/api/sesiones/usuario/${usuario.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((sesiones) => {
        const minDia = Array(7).fill(0);
        const sesDia = Array(7).fill(0);
        const minSem = Array(4).fill(0);

        const semanas = Array.from({ length: 4 }, (_, i) => {
          const inicio = getInicioSemanaOffset(i);
          const fin = new Date(inicio);
          fin.setDate(fin.getDate() + 7);
          return { inicio, fin };
        });

        sesiones.forEach((s) => {
          if (!s.fechaInicio) return;
          const fecha = new Date(s.fechaInicio);
          const diffDias = Math.floor((fecha - lunes) / (1000 * 60 * 60 * 24));
          if (diffDias >= 0 && diffDias < 7) {
            minDia[diffDias] += s.duracionMinutos || 0;
            sesDia[diffDias] += 1;
          }
          semanas.forEach(({ inicio, fin }, index) => {
            if (fecha >= inicio && fecha < fin) {
              minSem[3 - index] += s.duracionMinutos || 0;
            }
          });
        });

        setMinutosPorDia(minDia);
        setSesionesPorDia(sesDia);
        setMinutosPorSemana(minSem);
      })
      .catch(console.error)
      .finally(() => setCargando(false));
  }, [usuario]);

  if (cargando) return <p className="stats-empty">Cargando estadísticas...</p>;

  const labelStyle = { color: colors.textMuted, fontSize: "11px" };

  const chartBase = {
    chart: {
      backgroundColor: "transparent",
      style: { fontFamily: "Arial, sans-serif" },
      height: 220,
    },
    title: { text: null },
    credits: { enabled: false },
    accessibility: { enabled: false },
  };

  const chartBaseFull = { ...chartBase, chart: { ...chartBase.chart, height: 300 } };

  const donutData = DIAS.map((dia, i) => ({
    name: dia,
    y: sesionesPorDia[i],
  })).filter((d) => d.y > 0);

  const semLabels = Array.from({ length: 4 }, (_, i) => {
    const lunes = getInicioSemanaOffset(3 - i);
    return `${lunes.getDate()}/${lunes.getMonth() + 1}`;
  });

  const graficoBarras = (opts) => (
    <Chart options={opts}>
      <XAxis categories={DIAS} labels={{ style: labelStyle }} />
      <YAxis title={{ text: "Minutos", style: labelStyle }} min={0} labels={{ style: labelStyle }} />
      <Tooltip formatter={function () { return formatMinutes(this.y); }} />
      <ColumnSeries data={minutosPorDia} color={ACCENT} borderRadius={4} showInLegend={false} name="Minutos" />
    </Chart>
  );

  const graficoDonut = (opts) =>
    donutData.length === 0 ? (
      <p className="stats-empty">Sin sesiones esta semana.</p>
    ) : (
      <Chart options={opts}>
        <Tooltip formatter={function () { return formatSessionCount(this.y); }} />
        <PieSeries
          data={donutData}
          innerSize="55%"
          colors={["#7FAF82", "#9DC99F", "#5C8F60", "#D8EBD9", "#4a7a4d", "#b8d9ba", "#3a6b3d"]}
          showInLegend={true}
          name="Sesiones"
          dataLabels={{ enabled: true, format: "{point.name}", style: labelStyle }}
        />
      </Chart>
    );

  const graficoArea = (opts) => (
    <Chart options={opts}>
      <XAxis categories={semLabels} labels={{ style: labelStyle }} />
      <YAxis title={{ text: "Minutos", style: labelStyle }} min={0} labels={{ style: labelStyle }} />
      <Tooltip formatter={function () { return formatMinutes(this.y); }} />
      <AreaSeries
        data={minutosPorSemana}
        color={ACCENT}
        fillColor="rgba(127,175,130,0.15)"
        marker={{ radius: 5, fillColor: ACCENT, lineColor: "#fff", lineWidth: 2 }}
        showInLegend={false}
        name="Minutos"
      />
    </Chart>
  );

  if (!carousel) {
    return (
      <div className="statistics-wrapper">
        <div className="stats-section">
          <span className="stats-section-title">{SLIDES[0]}</span>
          <div className="stats-chart">{graficoBarras(chartBaseFull)}</div>
        </div>
        <div className="stats-section">
          <span className="stats-section-title">{SLIDES[1]}</span>
          <div className="stats-chart">{graficoDonut(chartBaseFull)}</div>
        </div>
        <div className="stats-section">
          <span className="stats-section-title">{SLIDES[2]}</span>
          <div className="stats-chart">{graficoArea(chartBaseFull)}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="statistics-wrapper">
      <div className="stats-header">
        <button className="stats-arrow" onClick={() => setSlide((s) => (s - 1 + SLIDES.length) % SLIDES.length)} aria-label="Anterior">
          <ChevronLeft size={16} />
        </button>
        <span className="stats-title">{SLIDES[slide]}</span>
        <button className="stats-arrow" onClick={() => setSlide((s) => (s + 1) % SLIDES.length)} aria-label="Siguiente">
          <ChevronRight size={16} />
        </button>
      </div>
      <div className="stats-chart">
        {slide === 0 && graficoBarras(chartBase)}
        {slide === 1 && graficoDonut(chartBase)}
        {slide === 2 && graficoArea(chartBase)}
      </div>
      <div className="stats-dots">
        {SLIDES.map((_, i) => (
          <button key={i} className={`stats-dot ${i === slide ? "active" : ""}`} onClick={() => setSlide(i)} aria-label={`Gráfico ${i + 1}`} />
        ))}
      </div>
    </div>
  );
}

export default memo(Statistics);
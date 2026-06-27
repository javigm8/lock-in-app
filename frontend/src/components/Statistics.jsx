import { useEffect, useState } from "react";
import { Chart, XAxis, YAxis, Tooltip } from "@highcharts/react";
import { ColumnSeries } from "@highcharts/react/series/Column";
import { AreaSeries } from "@highcharts/react/series/Area";
import { PieSeries } from "@highcharts/react/series/Pie";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTheme } from "../theme";
import "../styles/Statistics.css";

// Nombres de los días de la semana que se usan en los ejes y en las leyendas.
const DIAS = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
];

// Color principal para las series de los gráficos.
const ACCENT = "#7FAF82";

// Devuelve el primer día (lunes) de la semana actual.
function getInicioSemana() {
  const hoy = new Date();
  const dia = hoy.getDay();
  const diff = dia === 0 ? 6 : dia - 1; // Si es domingo, ajusta para que el lunes sea hace 6 días.
  const lunes = new Date(hoy);
  lunes.setHours(0, 0, 0, 0);
  lunes.setDate(hoy.getDate() - diff);
  return lunes;
}

// Devuelve el lunes de la semana desplazada en el pasado según el offset.
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

function Statistics({ usuario }) {
  const { colors } = useTheme();

  // Estado para los datos de los gráficos.
  const [minutosPorDia, setMinutosPorDia] = useState(Array(7).fill(0));
  const [sesionesPorDia, setSesionesPorDia] = useState(Array(7).fill(0));
  const [minutosPorSemana, setMinutosPorSemana] = useState(Array(4).fill(0));

  // Controla si aún se están cargando las estadísticas desde el backend.
  const [cargando, setCargando] = useState(true);

  // Índice de la diapositiva / gráfico visible.
  const [slide, setSlide] = useState(0);

  const SLIDES = [
    "Tiempo de focus semanal",
    "Sesiones por día esta semana",
    "Total acumulado · últimas 4 semanas",
  ];

  useEffect(() => {
    if (!usuario) return;

    // Se obtiene el token para autenticar la petición.
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

          // Si la sesión es de la semana actual, acumula minutos y cuenta sesiones por día.
          const diffDias = Math.floor((fecha - lunes) / (1000 * 60 * 60 * 24));
          if (diffDias >= 0 && diffDias < 7) {
            minDia[diffDias] += s.duracionMinutos || 0;
            sesDia[diffDias] += 1;
          }

          // También acumula los minutos por cada una de las últimas 4 semanas.
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

  // Estilo común para las etiquetas de los ejes.
  const labelStyle = { color: colors.textMuted, fontSize: "11px" };

  // Configuración base compartida por todos los gráficos.
  const chartBase = {
    chart: {
      backgroundColor: "transparent",
      style: { fontFamily: "Arial, sans-serif" },
      height: 220,
    },
    title: { text: null },
    credits: { enabled: false },
    accessibility: { enabled: false }
  };

  // Genera los datos para el gráfico de pastel, excluyendo días sin sesiones.
  const donutData = DIAS.map((dia, i) => ({
    name: dia,
    y: sesionesPorDia[i],
  })).filter((d) => d.y > 0);

  // Etiquetas de las últimas 4 semanas para el gráfico de área.
  const semLabels = Array.from({ length: 4 }, (_, i) => {
    const lunes = getInicioSemanaOffset(3 - i);
    return `${lunes.getDate()}/${lunes.getMonth() + 1}`;
  });

  return (
    <div className="statistics-wrapper">
      <div className="stats-header">
        <button
          className="stats-arrow"
          onClick={() => setSlide((s) => (s - 1 + SLIDES.length) % SLIDES.length)}
          aria-label="Anterior"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="stats-title">{SLIDES[slide]}</span>
        <button
          className="stats-arrow"
          onClick={() => setSlide((s) => (s + 1) % SLIDES.length)}
          aria-label="Siguiente"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="stats-chart">
        {slide === 0 && (
          // Primer gráfico: tiempo de enfoque por día de la semana actual.
          <Chart options={{ ...chartBase }}>
            <XAxis categories={DIAS} labels={{ style: labelStyle }} />
            <YAxis
              title={{ text: "Minutos", style: labelStyle }}
              min={0}
              labels={{ style: labelStyle }}
            />
            <Tooltip formatter={function () { return formatMinutes(this.y); }} />
            <ColumnSeries
              data={minutosPorDia}
              color={ACCENT}
              borderRadius={4}
              showInLegend={false}
              name="Minutos"
            />
          </Chart>
        )}

        {slide === 1 &&
          (donutData.length === 0 ? (
            <p className="stats-empty">Sin sesiones esta semana.</p>
          ) : (
            // Segundo gráfico: porcentaje de sesiones por día en la semana actual.
            <Chart options={{ ...chartBase }}>
              <Tooltip formatter={function () { return formatSessionCount(this.y); }} />
              <PieSeries
                data={donutData}
                innerSize="55%"
                colors={[
                  "#7FAF82",
                  "#9DC99F",
                  "#5C8F60",
                  "#D8EBD9",
                  "#4a7a4d",
                  "#b8d9ba",
                  "#3a6b3d",
                ]}
                showInLegend={true}
                name="Sesiones"
                dataLabels={{ enabled: true, format: "{point.name}", style: labelStyle }}
              />
            </Chart>
          ))}

        {slide === 2 && (
          // Tercer gráfico: minutos acumulados en las últimas 4 semanas.
          <Chart options={{ ...chartBase }}>
            <XAxis categories={semLabels} labels={{ style: labelStyle }} />
            <YAxis
              title={{ text: "Minutos", style: labelStyle }}
              min={0}
              labels={{ style: labelStyle }}
            />
            <Tooltip formatter={function () { return formatMinutes(this.y); }} />
            <AreaSeries
              data={minutosPorSemana}
              color={ACCENT}
              fillColor="rgba(127,175,130,0.15)"
              marker={{
                radius: 5,
                fillColor: ACCENT,
                lineColor: "#fff",
                lineWidth: 2,
              }}
              showInLegend={false}
              name="Minutos"
            />
          </Chart>
        )}
      </div>

      <div className="stats-dots">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            className={`stats-dot ${i === slide ? "active" : ""}`}
            onClick={() => setSlide(i)}
            aria-label={`Gráfico ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default Statistics;
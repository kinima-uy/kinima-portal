import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import * as api from "../lib/api.js";
import { useAuth } from "../lib/auth.jsx";
import { useData, haceCuanto } from "../lib/util.js";
import { PageHead, Loading, ErrorBox, Empty, Icon, Constancia, Pendientes } from "../components/ui.jsx";
import { Sparkline, Cintas } from "../components/viz.jsx";
import { Animo } from "../components/clinica.jsx";

const ALERTA = {
  familia: ["mensaje", "coral"], mensaje: ["mensaje", "teal"], consola: ["sinwifi", "yellow"], inactividad: ["reloj", "yellow"],
  baja: ["alerta", "coral"], sugerencia: ["idea", "teal"], asignar: ["asignar", "navy"],
};

const FILTROS = [["todos", "Todos"], ["atencion", "Necesitan atención"], ["sin_consola", "Sin consola"]];

export default function Pacientes() {
  const { profesional } = useAuth();
  const { data, error, loading, reload } = useData(() => api.getPacientes(profesional.id), [profesional.id]);
  const { data: alertas } = useData(() => api.getAlertas(profesional.id), [profesional.id]);
  const conAlerta = new Set((alertas || []).filter((a) => a.prioridad <= 2).map((a) => a.pacienteId));
  const [q, setQ] = useState("");
  const [f, setF] = useState("todos");

  const lista = useMemo(() => {
    if (!data) return [];
    return data.filter((p) => {
      if (q && !`${p.id} ${p.plan}`.toLowerCase().includes(q.toLowerCase())) return false;
      if (f === "atencion") return conAlerta.has(p.id);
      if (f === "sin_consola") return !p.consolaId;
      return true;
    });
  }, [data, q, f, alertas]); // eslint-disable-line react-hooks/exhaustive-deps

  const resumen = data && {
    activos: data.filter((p) => p.consolaId).length,
    semana: data.reduce((t, p) => t + p.sesionesSemana, 0),
    atencion: conAlerta.size,
  };
  const nombre = profesional.nombre.split(" ")[0];

  return (
    <div className="page">
      <section className="welcome">
        <Cintas className="welcome-cintas" />
        <div className="welcome-txt">
          <p className="eyebrow">Hola, {nombre}</p>
          <h1>Tus pacientes</h1>
          <p className="muted">{resumen ? `${resumen.semana} sesiones en casa esta semana.` : "Cargando la semana…"}</p>
        </div>
        <Link className="btn btn-navy" to="/asignar"><Icon name="asignar" size={18} />Nueva rutina</Link>
      </section>

      {resumen && (
        <div className="stats">
          <div className="stat"><span className="stat-ico t-teal"><Icon name="pacientes" /></span><div><b>{resumen.activos}</b><small>con consola en casa</small></div></div>
          <div className="stat"><span className="stat-ico t-yellow"><Icon name="calendario" /></span><div><b>{resumen.semana}</b><small>sesiones esta semana</small></div></div>
          <div className="stat"><span className="stat-ico t-coral"><Icon name="alerta" /></span><div><b>{resumen.atencion}</b><small>necesitan atención</small></div></div>
        </div>
      )}

      {alertas && alertas.length > 0 && (
        <section className="card revisar" aria-labelledby="rev-h">
          <div className="card-head"><h2 id="rev-h">Para revisar hoy</h2><small className="muted">{alertas.length} {alertas.length === 1 ? "cosa" : "cosas"} que pueden necesitar tu atención</small></div>
          <ul>
            {alertas.map((al) => {
              const [ico, c] = ALERTA[al.tipo];
              return (
                <li key={al.id}>
                  <Link to={al.to || `/pacientes/${al.pacienteId}${al.tab ? `?tab=${al.tab}` : ""}`} className="alerta">
                    <span className={`al-ico t-${c}`} aria-hidden="true"><Icon name={ico} size={18} /></span>
                    <span className="al-txt"><b><span className="al-pac">{al.pacienteId}</span>{al.titulo}</b>{al.texto && <small>{al.texto}</small>}</span>
                    <span className="al-go">{al.accion || "Ver"}<Icon name="flecha" size={16} /></span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <div className="toolbar">
        <label className="search">
          <Icon name="buscar" size={18} />
          <span className="sr">Buscar paciente</span>
          <input type="search" placeholder="Buscar por código o plan" value={q} onChange={(e) => setQ(e.target.value)} />
        </label>
        <div className="chips" role="group" aria-label="Filtrar pacientes">
          {FILTROS.map(([k, t]) => <button key={k} type="button" aria-pressed={f === k} onClick={() => setF(k)}>{t}</button>)}
        </div>
      </div>

      {loading && <Loading />}
      {error && <ErrorBox error={error} onRetry={reload} />}
      {data && !lista.length && <Empty title={q ? "No hay resultados" : "No hay pacientes en este filtro"}>{q ? "Probá con otro código." : "Cuando sumes pacientes, van a aparecer acá."}</Empty>}

      {!!lista.length && (
        <ul className="patients">
          {lista.map((p) => (
            <li key={p.id}>
              <Link to={`/pacientes/${p.id}`} className="pcard">
                <span className="pcode" aria-hidden="true">{p.id.slice(-2)}</span>
                <div className="pmain">
                  <b>{p.id}</b>
                  <small>{p.edad} años · {p.plan}</small>
                  <div className="pmeta">
                    {p.consolaId ? <span className="meta"><Icon name="consola" size={14} />{p.consolaId}</span> : <span className="meta muted"><Icon name="consola" size={14} />Sin consola</span>}
                    <span className="meta"><Icon name="reloj" size={14} />Última sesión: {haceCuanto(p.ultimaSesion)}</span>
                    <Pendientes n={p.pendientes} />
                    {p.sinLeer > 0 && <span className="pill pill-teal"><Icon name="mensaje" size={14} stroke={2.4} />{p.sinLeer} sin leer</span>}
                    {p.ultimoAnimo && <span className="meta">Se sintió: <Animo animo={p.ultimoAnimo} /></span>}
                  </div>
                </div>
                <div className="ptrend"><Sparkline valores={p.tendencia} /><small>tendencia</small></div>
                <div className="pside">
                  <Constancia hechas={p.sesionesSemana} objetivo={p.objetivoSemanal} />
                  <small>esta semana</small>
                </div>
                <Icon name="flecha" size={18} className="pgo" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

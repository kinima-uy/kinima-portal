import { Link } from "react-router-dom";
import * as api from "../lib/api.js";
import { useData, haceCuanto } from "../lib/util.js";
import { PageHead, Loading, ErrorBox, Icon, EstadoConsola } from "../components/ui.jsx";

export default function Consolas() {
  const { data, error, loading, reload } = useData(api.getConsolas);
  return (
    <div className="page">
      <PageHead eyebrow="Dispositivos en casa" title="Consolas" />
      <p className="muted intro">Cada consola es una Raspberry Pi con cámara en la casa de un paciente. Guarda las sesiones aunque no tenga internet y las envía cuando se conecta.</p>
      {loading && <Loading />}
      {error && <ErrorBox error={error} onRetry={reload} />}
      {data && (
        <ul className="consoles">
          {data.map((c) => (
            <li key={c.id} className="card ccard">
              <div className="row-between">
                <span className="cname"><span className="ex-ico" aria-hidden="true"><Icon name="consola" /></span><b>{c.id}</b></span>
                <EstadoConsola estado={c.estado} />
              </div>
              <dl className="kv">
                <div><dt>Paciente</dt><dd>{c.pacienteId ? <Link to={`/pacientes/${c.pacienteId}`}>{c.pacienteId}</Link> : "—"}</dd></div>
                <div><dt>Última sincronización</dt><dd>{haceCuanto(c.ultimaSync)}</dd></div>
                <div><dt>Asignación</dt><dd>{c.asignacionVersion ? `Versión ${c.asignacionVersion}` : "—"}</dd></div>
                <div><dt>Software</dt><dd>v{c.version}</dd></div>
              </dl>
              {c.pendientes > 0 && <p className="note-warn"><Icon name="nube" size={16} />{c.pendientes} sesiones guardadas esperando conexión</p>}
              {!c.pacienteId && <Link className="btn btn-line btn-sm" to="/asignar">Asignar a un paciente</Link>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

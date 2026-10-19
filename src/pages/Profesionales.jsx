import { useState } from "react";
import * as api from "../lib/api.js";
import { useAuth } from "../lib/auth.jsx";
import { useData } from "../lib/util.js";
import { PageHead, Loading, ErrorBox, Icon } from "../components/ui.jsx";

export default function Profesionales() {
  const { profesional: yo } = useAuth();
  const { data, error, loading, reload } = useData(api.getProfesionales);
  const [busy, setBusy] = useState(null);
  const toggle = async (p) => { setBusy(p.id); await api.setProfesionalActivo(p.id, !p.activo); setBusy(null); reload(); };

  return (
    <div className="page">
      <PageHead eyebrow="Administración" title="Profesionales">
        <button className="btn btn-navy" disabled title="Próximamente"><Icon name="asignar" size={18} />Invitar profesional</button>
      </PageHead>
      <p className="muted intro">Habilitá o retirá el acceso al portal. Al retirarlo, la persona deja de ver pacientes y consolas, pero sus datos se conservan.</p>
      {loading && <Loading />}
      {error && <ErrorBox error={error} onRetry={reload} />}
      {data && (
        <ul className="people card">
          {data.map((p) => (
            <li key={p.id}>
              <span className={`avatar ${p.activo ? "" : "off"}`} aria-hidden="true">{p.nombre.split(" ").map((x) => x[0]).join("")}</span>
              <div className="pinfo">
                <b>{p.nombre}{p.rol === "admin" && <span className="pill pill-neutral">Admin</span>}{p.id === yo.id && <span className="pill pill-neutral">Vos</span>}</b>
                <small>{p.especialidad} · {p.email}</small>
              </div>
              <span className={`pill ${p.activo ? "pill-ok" : "pill-neutral"}`}><Icon name={p.activo ? "ok" : "candado"} size={14} stroke={2.4} />{p.activo ? "Con acceso" : "Sin acceso"}</span>
              {p.id !== yo.id && (
                <button className="btn btn-line btn-sm" disabled={busy === p.id} onClick={() => toggle(p)}>{p.activo ? "Retirar acceso" : "Habilitar"}</button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

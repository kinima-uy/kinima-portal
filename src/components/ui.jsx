
/* Íconos de línea al estilo MingCute (el set del manual de marca). */
const PATHS = {
  pacientes: <><circle cx="9" cy="8" r="3.5" /><path d="M3 20c.8-3.5 3.2-5 6-5s5.2 1.5 6 5M16 4.5a3.5 3.5 0 0 1 0 7M18 15c1.6.6 2.6 2.2 3 5" /></>,
  asignar: <><rect x="4" y="4" width="16" height="16" rx="3" /><path d="M12 8v8M8 12h8" /></>,
  consola: <><rect x="3" y="5" width="18" height="12" rx="2" /><path d="M8 21h8M12 17v4" /><circle cx="12" cy="11" r="2" /></>,
  equipo: <><path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z" /><path d="M9 12l2 2 4-4" /></>,
  salir: <><path d="M14 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4M10 16l-4-4 4-4M6 12h10" /></>,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  cerrar: <path d="M6 6l12 12M18 6L6 18" />,
  buscar: <><circle cx="11" cy="11" r="6.5" /><path d="M20 20l-4-4" /></>,
  flecha: <path d="M5 12h14M13 6l6 6-6 6" />,
  atras: <path d="M19 12H5M11 6l-6 6 6 6" />,
  ok: <path d="M5 12l5 5 9-10" />,
  alerta: <><path d="M12 3l9.5 17h-19z" /><path d="M12 10v4M12 17.5v.01" /></>,
  nube: <><path d="M7 18a4.5 4.5 0 0 1-.6-9A6 6 0 0 1 18 9.5a4.2 4.2 0 0 1-.5 8.5z" /><path d="M12 11v5M9.5 13.5L12 16l2.5-2.5" /></>,
  wifi: <><path d="M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0" /><circle cx="12" cy="19.5" r="1" fill="currentColor" /></>,
  sinwifi: <><path d="M5 12.5a10 10 0 0 1 7-3M15.5 10.3A10 10 0 0 1 19 12.5M8.5 16a5 5 0 0 1 4-1.4" /><path d="M4 4l16 16" /><circle cx="12" cy="19.5" r="1" fill="currentColor" /></>,
  reloj: <><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></>,
  objetivo: <><circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="4.5" /><circle cx="12" cy="12" r="1" fill="currentColor" /></>,
  calendario: <><rect x="4" y="5" width="16" height="15" rx="2.5" /><path d="M4 10h16M9 3v4M15 3v4" /></>,
  nota: <><path d="M6 3h9l4 4v14H6z" /><path d="M14 3v5h5M9 13h7M9 17h5" /></>,
  ojo: <><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" /><circle cx="12" cy="12" r="3" /></>,
  mensaje: <><path d="M4 5h16v11H9l-5 4z" /><path d="M8 9.5h8M8 12.5h5" /></>,
  enviar: <path d="M4 12l16-8-6 16-3-7z" />,
  descargar: <><path d="M12 4v11M7 10l5 5 5-5" /><path d="M5 20h14" /></>,
  idea: <><path d="M9 18h6M10 21h4" /><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z" /></>,
  meta: <><path d="M5 21V4" /><path d="M5 4h11l-2 4 2 4H5" /></>,
  libro: <><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z" /><path d="M4 19V5M9 7h6" /></>,
  mas: <path d="M12 5v14M5 12h14" />,
  basura: <><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" /></>,
  plantilla: <><rect x="4" y="4" width="16" height="16" rx="3" /><path d="M4 9h16M9 9v11" /></>,
  play: <path d="M8 5v14l11-7z" />,
  candado: <><rect x="5" y="11" width="14" height="10" rx="2.5" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></>,
};
export function Icon({ name, size = 20, stroke = 2, ...rest }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...rest}>
      {PATHS[name]}
    </svg>
  );
}

export function PageHead({ eyebrow, title, children, back }) {
  return (
    <header className="page-head">
      <div>
        {back}
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1>{title}</h1>
      </div>
      {children && <div className="page-actions">{children}</div>}
    </header>
  );
}

export const Loading = ({ label = "Cargando…" }) => <div className="state" role="status"><span className="spinner" aria-hidden="true" />{label}</div>;
export const ErrorBox = ({ error, onRetry }) => (
  <div className="state state-error" role="alert"><Icon name="alerta" />{error?.message || "Algo salió mal."}{onRetry && <button className="btn btn-line btn-sm" onClick={onRetry}>Reintentar</button>}</div>
);
export const Empty = ({ icon = "pacientes", title, children }) => (
  <div className="empty"><span className="empty-ico"><Icon name={icon} size={26} /></span><h3>{title}</h3>{children && <p>{children}</p>}</div>
);

/* Estado de consola: siempre ícono + texto, nunca solo color. */
const ESTADOS = {
  en_linea: { t: "En línea", c: "ok", i: "wifi" },
  sin_conexion: { t: "Sin conexión", c: "warn", i: "sinwifi" },
  sin_asignar: { t: "Sin asignar", c: "neutral", i: "consola" },
};
export function EstadoConsola({ estado }) {
  const e = ESTADOS[estado] || ESTADOS.sin_asignar;
  return <span className={`pill pill-${e.c}`}><Icon name={e.i} size={14} stroke={2.4} />{e.t}</span>;
}

export function Pendientes({ n }) {
  if (!n) return null;
  return <span className="pill pill-warn"><Icon name="nube" size={14} stroke={2.4} />{n} sin sincronizar</span>;
}

/* Constancia de la semana: anillo con sesiones hechas / objetivo. */
export function Constancia({ hechas, objetivo, size = 46 }) {
  const r = (size - 8) / 2, c = 2 * Math.PI * r, pct = Math.min(1, hechas / (objetivo || 1));
  return (
    <span className="ring" style={{ width: size, height: size }} role="img" aria-label={`${hechas} de ${objetivo} sesiones esta semana`}>
      <svg width={size} height={size} aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--line)" strokeWidth="6" />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={pct >= 1 ? "var(--teal)" : "var(--yellow)"} strokeWidth="6" strokeLinecap="round"
          strokeDasharray={`${c * pct} ${c}`} transform={`rotate(-90 ${size / 2} ${size / 2})`} />
      </svg>
      <b>{hechas}/{objetivo}</b>
    </span>
  );
}

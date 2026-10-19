/*
 * Capa de datos del portal.
 *
 * Hoy responde con DATOS DE PRUEBA (src/data/mock.js) para poder diseñar sin servidor.
 * Cuando la API central esté publicada (por ejemplo https://central.kinima.uy), cada función
 * se reemplaza por un fetch a esa ruta y las pantallas no cambian, porque reciben los mismos datos.
 *
 *   export const API_URL = "https://central.kinima.uy";
 *   export const getPacientes = () => request("/pacientes");
 *
 * Nunca va acá la contraseña de la base de datos ni ningún secreto: el portal solo habla con la API.
 * Las alertas y sugerencias se calculan acá para el diseño; con la API real conviene calcularlas en el servidor.
 */
import { PROFESIONALES, PACIENTES, CONSOLAS, ASIGNACIONES, SESIONES, EJERCICIOS, METAS, MENSAJES, PLANTILLAS } from "../data/mock.js";

export const USING_MOCK = true;
const DEMO_PASSWORD = "kinima2026";

const db = {
  profesionales: structuredClone(PROFESIONALES),
  pacientes: structuredClone(PACIENTES),
  consolas: structuredClone(CONSOLAS),
  asignaciones: structuredClone(ASIGNACIONES),
  sesiones: structuredClone(SESIONES),
  metas: structuredClone(METAS),
  mensajes: structuredClone(MENSAJES),
  plantillas: structuredClone(PLANTILLAS),
  descartadas: new Set(),
};

const wait = (v, ms = 250) => new Promise((r) => setTimeout(() => r(structuredClone(v)), ms));
const fail = (msg, ms = 400) => new Promise((_, rej) => setTimeout(() => rej(new Error(msg)), ms));
const DIA = 864e5;
const avg = (a) => (a.length ? Math.round(a.reduce((t, v) => t + v, 0) / a.length) : null);

/* ---------- sesión ---------- */
export function login(email, password) {
  const pro = db.profesionales.find((p) => p.email.toLowerCase() === email.trim().toLowerCase());
  if (!pro || password !== DEMO_PASSWORD) return fail("El mail o la contraseña no son correctos.");
  if (!pro.activo) return fail("Tu acceso está deshabilitado. Hablá con quien administra Kinima en tu centro.");
  return wait({ token: "demo-token", profesional: pro }, 500);
}

/* ---------- cálculos ---------- */
function racha(ses) {
  const dias = new Set(ses.map((s) => new Date(s.fecha).toDateString()));
  const d = new Date(); let n = 0;
  if (!dias.has(d.toDateString())) d.setDate(d.getDate() - 1);
  while (dias.has(d.toDateString())) { n++; d.setDate(d.getDate() - 1); }
  return n;
}

/* Mapa de alcance (datos de prueba): posición de cada objetivo (0 a 1) y si se tocó.
   Con la API real, la consola enviaría estas posiciones con cada sesión, sin video. */
function alcance(p, ses) {
  let seed = [...p.id].reduce((a, c) => a + c.charCodeAt(0), 0);
  const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
  const dificil = p.plan.includes("izquierdo") ? [0.15, 0.2] : p.plan.includes("derecha") ? [0.85, 0.2] : [0.5, 0.15];
  return ses.slice(-3).flatMap((s) => [...Array(s.objetivos)].map(() => {
    const x = rnd(), y = rnd(), dist = Math.hypot(x - dificil[0], y - dificil[1]);
    return { x, y, hit: rnd() < Math.min(0.97, 0.35 + dist * 1.1) };
  }));
}
export const ZONAS = { "Arriba izq.": [0, 0], "Arriba der.": [0.5, 0], "Abajo izq.": [0, 0.5], "Abajo der.": [0.5, 0.5] };
function pctZona(puntos, zona) {
  const [zx, zy] = ZONAS[zona];
  const en = puntos.filter((p) => p.x >= zx && p.x < zx + 0.5 && p.y >= zy && p.y < zy + 0.5);
  return en.length ? Math.round((en.filter((p) => p.hit).length / en.length) * 100) : 0;
}

const TAMANOS = ["Grande", "Mediano", "Chico"];
/* Sugerencia de ajuste: si las últimas 3 sesiones superan 85%, proponer más dificultad; si quedan bajo 45%, menos.
   El profesional decide: la sugerencia nunca se aplica sola. */
function sugerencia(p, ses, asig) {
  if (!asig || db.descartadas.has(`${p.id}-v${asig.version}`)) return null;
  /* solo cuentan las sesiones hechas con la rutina actual */
  const ult = ses.filter((s) => s.sincronizada && s.fecha > asig.creada).slice(0, 3).map((s) => s.puntaje);
  if (ult.length < 3) return null;
  const b = structuredClone(asig.bloques[asig.bloques.length - 1]);
  const c = b.config, i = TAMANOS.indexOf(c.tamano);
  if (ult.every((v) => v >= 85)) {
    const cambio = i < 2 ? { tamano: TAMANOS[i + 1] } : { objetivos: Math.min(60, c.objetivos + 5) };
    const txt = cambio.tamano ? `objetivos ${cambio.tamano.toLowerCase()}s` : `${cambio.objetivos} objetivos por sesión`;
    return { tipo: "subir", titulo: "Está lista para un poco más de desafío", texto: `Superó el 85% en sus últimas 3 sesiones (${ult.join("%, ")}%). Te sugerimos pasar a ${txt}.`, cambio, bloque: asig.bloques.length - 1 };
  }
  if (ult.every((v) => v < 45)) {
    const cambio = i > 0 ? { tamano: TAMANOS[i - 1] } : { objetivos: Math.max(5, c.objetivos - 5) };
    const txt = cambio.tamano ? `objetivos ${cambio.tamano.toLowerCase()}s` : `${cambio.objetivos} objetivos por sesión`;
    return { tipo: "bajar", titulo: "Puede estar costándole", texto: `Quedó por debajo del 45% en sus últimas 3 sesiones. Te sugerimos pasar a ${txt}.`, cambio, bloque: asig.bloques.length - 1 };
  }
  return null;
}

function metasDe(p, ses, puntos, constancia) {
  return db.metas.filter((m) => m.pacienteId === p.id).map((m) => {
    const actual = m.metrica === "puntaje" ? avg(ses.filter((s) => s.sincronizada).slice(0, 3).map((s) => s.puntaje)) ?? 0
      : m.metrica === "constancia" ? constancia : pctZona(puntos, m.zona);
    const avance = Math.max(0, Math.min(100, Math.round(((actual - m.base) / (m.objetivo - m.base || 1)) * 100)));
    return { ...m, actual, avance, lograda: actual >= m.objetivo };
  });
}

function resumen(p) {
  const ses = db.sesiones.filter((s) => s.pacienteId === p.id).sort((a, b) => b.fecha.localeCompare(a.fecha));
  const t = Date.now();
  const enSemana = ses.filter((s) => new Date(s.fecha).getTime() >= t - 7 * DIA);
  const semanaPrev = ses.filter((s) => { const x = new Date(s.fecha).getTime(); return x < t - 7 * DIA && x >= t - 14 * DIA; });
  const asig = db.asignaciones.filter((a) => a.pacienteId === p.id).sort((a, b) => b.version - a.version)[0] || null;
  const constancia = Math.min(100, Math.round((ses.filter((s) => new Date(s.fecha).getTime() >= t - 28 * DIA).length / (p.objetivoSemanal * 4)) * 100));
  return {
    ...p,
    ultimaSesion: ses[0]?.fecha || null,
    sesionesSemana: enSemana.length,
    promedioSemana: avg(enSemana.map((s) => s.puntaje)),
    promedioSemanaPrev: avg(semanaPrev.map((s) => s.puntaje)),
    pendientes: ses.filter((s) => !s.sincronizada).length,
    asignacion: asig,
    tendencia: ses.slice(0, 8).reverse().map((s) => s.puntaje),
    constancia,
    racha: racha(ses),
    sugerencia: sugerencia(p, ses, asig),
    sinLeer: db.mensajes.filter((m) => m.pacienteId === p.id && m.de === "familia" && !m.leido).length,
    ultimoAnimo: ses.find((s) => s.animo)?.animo || null,
  };
}

/* ---------- pacientes ---------- */
export const getPacientes = (profesionalId) =>
  wait(db.pacientes.filter((p) => !profesionalId || p.profesionalId === profesionalId).map(resumen));

export function getPaciente(id) {
  const p = db.pacientes.find((x) => x.id === id);
  if (!p) return fail("No encontramos ese paciente.");
  const r = resumen(p);
  const sesiones = db.sesiones.filter((s) => s.pacienteId === id).sort((a, b) => a.fecha.localeCompare(b.fecha));
  const historial = db.asignaciones.filter((a) => a.pacienteId === id).sort((a, b) => b.version - a.version);
  const puntos = alcance(p, sesiones);
  const profesional = db.profesionales.find((x) => x.id === p.profesionalId);
  return wait({
    ...r, sesiones, historial, alcance: puntos, profesional,
    metas: metasDe(p, [...sesiones].reverse(), puntos, r.constancia),
    mensajes: db.mensajes.filter((m) => m.pacienteId === id).sort((a, b) => a.fecha.localeCompare(b.fecha)),
    consola: db.consolas.find((c) => c.id === p.consolaId) || null,
  });
}

export function guardarNota(id, nota) {
  db.pacientes.find((x) => x.id === id).nota = nota;
  return wait({ ok: true });
}

/* ---------- "Para revisar hoy" ---------- */
export function getAlertas(profesionalId) {
  const out = [];
  const t = Date.now();
  db.pacientes.filter((p) => p.profesionalId === profesionalId).forEach((p) => {
    const r = resumen(p);
    const ses = db.sesiones.filter((s) => s.pacienteId === p.id).sort((a, b) => b.fecha.localeCompare(a.fecha));
    const con = db.consolas.find((c) => c.id === p.consolaId);
    const reciente = ses.find((s) => (s.animo === "dolor" || s.animo === "cansado") && new Date(s.fecha).getTime() > t - 3 * DIA);
    if (reciente?.animo === "dolor") out.push({ id: `${p.id}-dolor`, tipo: "familia", prioridad: 1, pacienteId: p.id, titulo: "La familia avisó que le molestó", texto: reciente.comentarioFamilia || "Marcó “le molestó” después de jugar.", accion: "Ver mensajes", tab: "familia" });
    if (r.sinLeer && reciente?.animo !== "dolor") out.push({ id: `${p.id}-msg`, tipo: "mensaje", prioridad: 3, pacienteId: p.id, titulo: `${r.sinLeer} mensaje${r.sinLeer > 1 ? "s" : ""} de la familia`, texto: db.mensajes.filter((m) => m.pacienteId === p.id && !m.leido).at(-1)?.texto, accion: "Responder", tab: "familia" });
    if (con?.estado === "sin_conexion" && t - new Date(con.ultimaSync).getTime() > DIA) out.push({ id: `${p.id}-con`, tipo: "consola", prioridad: 2, pacienteId: p.id, titulo: `${con.id} sin conexión hace ${Math.round((t - new Date(con.ultimaSync).getTime()) / 36e5)} h`, texto: r.pendientes ? `Tiene ${r.pendientes} sesiones guardadas esperando internet.` : "Puede que la familia necesite ayuda con el wifi." });
    if (r.consolaId && r.ultimaSesion && t - new Date(r.ultimaSesion).getTime() > 3 * DIA) out.push({ id: `${p.id}-inac`, tipo: "inactividad", prioridad: 2, pacienteId: p.id, titulo: `Lleva ${Math.floor((t - new Date(r.ultimaSesion).getTime()) / DIA)} días sin jugar`, texto: "Puede ser buen momento para escribirle a la familia.", accion: "Escribir", tab: "familia" });
    if (r.promedioSemana != null && r.promedioSemanaPrev != null && r.promedioSemana < r.promedioSemanaPrev - 10) out.push({ id: `${p.id}-baja`, tipo: "baja", prioridad: 2, pacienteId: p.id, titulo: `Bajó su puntaje (${r.promedioSemanaPrev} → ${r.promedioSemana})`, texto: "Comparado con la semana anterior." });
    if (r.sugerencia) out.push({ id: `${p.id}-sug`, tipo: "sugerencia", prioridad: 3, pacienteId: p.id, titulo: r.sugerencia.titulo, texto: r.sugerencia.texto, accion: "Revisar sugerencia" });
    if (!r.consolaId) out.push({ id: `${p.id}-asig`, tipo: "asignar", prioridad: 4, pacienteId: p.id, titulo: "Sin consola asignada", texto: "Asignale una rutina y una consola para que empiece en casa.", accion: "Asignar", to: `/asignar?paciente=${p.id}` });
  });
  return wait(out.sort((a, b) => a.prioridad - b.prioridad));
}

/* ---------- consolas, ejercicios, plantillas ---------- */
export const getConsolas = () => wait(db.consolas);
export const getEjercicios = () => wait(EJERCICIOS, 100);
export const getPlantillas = () => wait(db.plantillas, 100);
export function guardarPlantilla({ nombre, dias, bloques }) {
  const pl = { id: `pl-${Date.now()}`, nombre, dias, bloques };
  db.plantillas.push(pl);
  return wait(pl);
}

/* Asignación = rutina (días + bloques). Cada cambio crea una versión nueva que la consola descarga al sincronizar. */
export function crearAsignacion({ pacienteId, consolaId, dias, bloques, motivo = "Cambio de rutina" }) {
  const prev = db.asignaciones.filter((a) => a.pacienteId === pacienteId).reduce((v, a) => Math.max(v, a.version), 0);
  const nueva = { id: `as-${Date.now()}`, pacienteId, consolaId, dias, bloques, version: prev + 1, creada: new Date().toISOString(), motivo };
  db.asignaciones.push(nueva);
  db.pacientes.find((p) => p.id === pacienteId).consolaId = consolaId;
  db.consolas.forEach((c) => { if (c.pacienteId === pacienteId && c.id !== consolaId) { c.pacienteId = null; c.estado = c.estado === "en_linea" ? "sin_asignar" : c.estado; } });
  const con = db.consolas.find((c) => c.id === consolaId); con.pacienteId = pacienteId; con.asignacionVersion = nueva.version;
  if (con.estado === "sin_asignar") con.estado = "en_linea";
  return wait(nueva, 600);
}

export function aplicarSugerencia(pacienteId) {
  const p = db.pacientes.find((x) => x.id === pacienteId);
  const ses = db.sesiones.filter((s) => s.pacienteId === pacienteId).sort((a, b) => b.fecha.localeCompare(a.fecha));
  const asig = db.asignaciones.filter((a) => a.pacienteId === pacienteId).sort((a, b) => b.version - a.version)[0];
  const sug = sugerencia(p, ses, asig);
  if (!sug) return fail("La sugerencia ya no aplica.");
  const bloques = structuredClone(asig.bloques);
  Object.assign(bloques[sug.bloque].config, sug.cambio);
  return crearAsignacion({ pacienteId, consolaId: asig.consolaId, dias: asig.dias, bloques, motivo: `Sugerencia aplicada: ${Object.entries(sug.cambio).map(([k, v]) => `${k === "tamano" ? "tamaño" : k} ${String(v).toLowerCase()}`).join(", ")}` });
}

export function descartarSugerencia(pacienteId) {
  const asig = db.asignaciones.filter((a) => a.pacienteId === pacienteId).sort((a, b) => b.version - a.version)[0];
  db.descartadas.add(`${pacienteId}-v${asig.version}`);
  return wait({ ok: true }, 100);
}

/* ---------- objetivos terapéuticos ---------- */
export function agregarMeta(meta) {
  const m = { id: `m-${Date.now()}`, ...meta };
  db.metas.push(m);
  return wait(m);
}
export function borrarMeta(id) {
  db.metas = db.metas.filter((m) => m.id !== id);
  return wait({ ok: true });
}

/* ---------- mensajes con la familia ---------- */
export function enviarMensaje(pacienteId, texto, autor) {
  const m = { id: `ms-${Date.now()}`, pacienteId, de: "profesional", autor, texto, fecha: new Date().toISOString(), leido: true };
  db.mensajes.push(m);
  return wait(m, 300);
}
export function marcarLeidos(pacienteId) {
  db.mensajes.forEach((m) => { if (m.pacienteId === pacienteId) m.leido = true; });
  return wait({ ok: true }, 50);
}

/* ---------- profesionales (solo admin) ---------- */
export const getProfesionales = () => wait(db.profesionales);
export function setProfesionalActivo(id, activo) {
  db.profesionales.find((p) => p.id === id).activo = activo;
  return wait({ ok: true });
}

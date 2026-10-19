/*
 * DATOS DE PRUEBA — todo inventado.
 * Tienen la misma forma que pensamos usar con la API central (central.kinima.uy).
 * Los pacientes se identifican con un código interno, nunca con nombre completo.
 */

export const PROFESIONALES = [
  { id: "pro-1", nombre: "Laura Pereira", email: "demo@kinima.uy", rol: "admin", especialidad: "Fisioterapeuta", centro: "Centro de prueba", activo: true },
  { id: "pro-2", nombre: "Martín Silva", email: "martin@kinima.uy", rol: "profesional", especialidad: "Terapeuta ocupacional", centro: "Centro de prueba", activo: true },
  { id: "pro-3", nombre: "Ana Rodríguez", email: "ana@kinima.uy", rol: "profesional", especialidad: "Fisioterapeuta", centro: "Centro de prueba", activo: false },
];

/* Ejercicios disponibles en la consola. El primero es el que ya funciona en el prototipo de la Raspberry:
   la cámara (MediaPipe) sigue la punta del dedo y el niño toca objetivos en la pantalla. */
export const EJERCICIOS = [
  {
    id: "objetivos", nombre: "Alcanzar objetivos", descripcion: "La cámara sigue la punta del dedo y el niño toca los objetivos que aparecen en la tele.",
    disponible: true, trabaja: ["Motricidad fina", "Coordinación ojo-mano", "Rango de movimiento del hombro"],
    indicaciones: "Sentado o de pie a 1,5–2 m de la tele, con buena luz. Se puede achicar la zona para trabajar un solo lado.",
    campos: [
      { id: "objetivos", label: "Objetivos por sesión", tipo: "numero", min: 5, max: 60, paso: 5, defecto: 20 },
      { id: "duracion", label: "Duración máxima", tipo: "numero", min: 1, max: 15, paso: 1, defecto: 5, unidad: "min" },
      { id: "tamano", label: "Tamaño de los objetivos", tipo: "opciones", opciones: ["Grande", "Mediano", "Chico"], defecto: "Grande" },
      { id: "mano", label: "Mano", tipo: "opciones", opciones: ["Derecha", "Izquierda", "Alternar"], defecto: "Derecha" },
      { id: "zona", label: "Zona de la pantalla", tipo: "opciones", opciones: ["Centro", "Toda la pantalla", "Lado de la mano"], defecto: "Centro" },
    ],
  },
  { id: "estrellas", nombre: "Atrapar estrellas", descripcion: "Saltar para atrapar las estrellas que caen del cielo.", disponible: false, trabaja: ["Potencia de piernas", "Equilibrio"], indicaciones: "Se necesita espacio libre alrededor.", campos: [] },
  { id: "marcha", nombre: "Marcha en el lugar", descripcion: "Levantar las rodillas al ritmo del camino para avanzar por el paisaje.", disponible: false, trabaja: ["Coordinación", "Resistencia", "Marcha"], indicaciones: "De pie, frente a la tele.", campos: [] },
];

const hoy = new Date();
const dia = (n, h = 17, m = 30) => { const d = new Date(hoy); d.setDate(d.getDate() - n); d.setHours(h, m, 0, 0); return d.toISOString(); };
const hace = (min) => new Date(hoy.getTime() - min * 60000).toISOString();

export const CONSOLAS = [
  { id: "RPI-01", nombre: "Consola 01", estado: "en_linea", ultimaSync: hace(12), version: "0.4.2", pacienteId: "KN-0142", asignacionVersion: 3, pendientes: 0 },
  { id: "RPI-02", nombre: "Consola 02", estado: "en_linea", ultimaSync: hace(95), version: "0.4.2", pacienteId: "KN-0157", asignacionVersion: 1, pendientes: 0 },
  { id: "RPI-03", nombre: "Consola 03", estado: "sin_conexion", ultimaSync: hace(60 * 30), version: "0.4.1", pacienteId: "KN-0163", asignacionVersion: 2, pendientes: 2 },
  { id: "RPI-04", nombre: "Consola 04", estado: "sin_asignar", ultimaSync: hace(60 * 50), version: "0.4.2", pacienteId: null, asignacionVersion: 0, pendientes: 0 },
];

export const PACIENTES = [
  { id: "KN-0142", edad: 7, plan: "Motricidad fina · mano derecha", profesionalId: "pro-1", consolaId: "RPI-01", objetivoSemanal: 5, inicio: dia(24), nota: "Muy motivada con el juego. Subir dificultad de a poco." },
  { id: "KN-0157", edad: 9, plan: "Coordinación ojo-mano", profesionalId: "pro-1", consolaId: "RPI-02", objetivoSemanal: 4, inicio: dia(12), nota: "" },
  { id: "KN-0163", edad: 6, plan: "Rango de movimiento · hombro izquierdo", profesionalId: "pro-1", consolaId: "RPI-03", objetivoSemanal: 5, inicio: dia(30), nota: "La consola estuvo sin internet; hay sesiones pendientes de sincronizar." },
  { id: "KN-0171", edad: 8, plan: "Motricidad fina · ambas manos", profesionalId: "pro-1", consolaId: null, objetivoSemanal: 3, inicio: dia(2), nota: "Esperando que la familia reciba el kit." },
  { id: "KN-0119", edad: 10, plan: "Coordinación bilateral", profesionalId: "pro-2", consolaId: null, objetivoSemanal: 4, inicio: dia(40), nota: "" },
];

const OBJ = (objetivos, duracion, tamano, mano, zona) => ({ ejercicioId: "objetivos", config: { objetivos, duracion, tamano, mano, zona } });

/* Asignación = rutina: días de la semana (0 = domingo) y uno o más bloques de ejercicio. Cada cambio crea una versión nueva. */
export const ASIGNACIONES = [
  { id: "as-1a", pacienteId: "KN-0142", consolaId: "RPI-01", dias: [1, 3, 5], bloques: [OBJ(15, 4, "Grande", "Derecha", "Centro")], version: 1, creada: dia(21, 10), motivo: "Inicio" },
  { id: "as-1b", pacienteId: "KN-0142", consolaId: "RPI-01", dias: [1, 2, 3, 4, 5], bloques: [OBJ(20, 5, "Grande", "Derecha", "Toda la pantalla")], version: 2, creada: dia(13, 10), motivo: "Más días y toda la pantalla" },
  { id: "as-1c", pacienteId: "KN-0142", consolaId: "RPI-01", dias: [1, 2, 3, 4, 5], bloques: [OBJ(25, 6, "Mediano", "Derecha", "Toda la pantalla")], version: 3, creada: dia(6, 10), motivo: "Sugerencia aplicada: objetivos más chicos" },
  { id: "as-2", pacienteId: "KN-0157", consolaId: "RPI-02", dias: [1, 3, 5, 6], bloques: [OBJ(20, 5, "Grande", "Alternar", "Centro")], version: 1, creada: dia(12, 11), motivo: "Inicio" },
  { id: "as-3a", pacienteId: "KN-0163", consolaId: "RPI-03", dias: [1, 2, 3, 4, 5], bloques: [OBJ(10, 4, "Grande", "Izquierda", "Centro")], version: 1, creada: dia(26, 9), motivo: "Inicio" },
  { id: "as-3b", pacienteId: "KN-0163", consolaId: "RPI-03", dias: [1, 2, 3, 4, 5], bloques: [OBJ(15, 5, "Grande", "Izquierda", "Lado de la mano"), OBJ(10, 3, "Grande", "Derecha", "Centro")], version: 2, creada: dia(14, 9), motivo: "Se suma un bloque con la mano derecha para entrar en calor" },
];

/* Plantillas de rutina reutilizables entre pacientes parecidos. */
export const PLANTILLAS = [
  { id: "pl-1", nombre: "Inicio suave", dias: [1, 3, 5], bloques: [OBJ(10, 3, "Grande", "Derecha", "Centro")] },
  { id: "pl-2", nombre: "Hombro · rango de movimiento", dias: [1, 2, 3, 4, 5], bloques: [OBJ(10, 3, "Grande", "Derecha", "Centro"), OBJ(15, 5, "Grande", "Izquierda", "Lado de la mano")] },
  { id: "pl-3", nombre: "Precisión mano dominante", dias: [1, 2, 4, 5], bloques: [OBJ(25, 6, "Chico", "Derecha", "Toda la pantalla")] },
];

/* Cómo se sintió (lo marca la familia o el niño en la app familiar después de jugar). */
export const ANIMOS = {
  contento: { emoji: "😄", t: "Contento" },
  normal: { emoji: "🙂", t: "Bien" },
  cansado: { emoji: "😴", t: "Cansado" },
  dolor: { emoji: "😣", t: "Le molestó" },
};

/* Sesiones: lo que la consola calcula y envía (sin video). */
function serie(pacienteId, consolaId, dias, objetivos, base, animos = {}) {
  return dias.map((d, i) => {
    const aciertos = Math.min(objetivos, Math.round(base + i * 0.9 + ((i * 7) % 3)));
    const a = animos[i] || (i % 4 === 1 ? ["normal"] : ["contento"]);
    return {
      id: `${pacienteId}-s${i}`, pacienteId, consolaId, fecha: dia(d, 17 + (i % 3), (i * 13) % 60),
      duracionSeg: 240 + ((i * 37) % 120), objetivos, aciertos, puntaje: Math.round((aciertos / objetivos) * 100),
      sincronizada: true, animo: a[0], comentarioFamilia: a[1] || "",
    };
  });
}
export const SESIONES = [
  ...serie("KN-0142", "RPI-01", [20, 19, 17, 16, 14, 13, 12, 10, 9, 7, 6, 5, 3, 2, 1, 0], 25, 13, { 15: ["contento", "¡Quiso jugar dos veces!"] }),
  ...serie("KN-0157", "RPI-02", [11, 9, 8, 6, 4, 2], 20, 9, { 3: ["cansado"], 5: ["dolor", "Al final dijo que le molestaba el brazo."] }),
  ...serie("KN-0163", "RPI-03", [25, 23, 21, 18, 16, 15, 13, 11], 15, 6, { 6: ["cansado", "Estaba con sueño."] }),
  { id: "KN-0163-p1", pacienteId: "KN-0163", consolaId: "RPI-03", fecha: dia(1), duracionSeg: 280, objetivos: 15, aciertos: 12, puntaje: 80, sincronizada: false, animo: null, comentarioFamilia: "" },
  { id: "KN-0163-p2", pacienteId: "KN-0163", consolaId: "RPI-03", fecha: dia(0, 11), duracionSeg: 300, objetivos: 15, aciertos: 13, puntaje: 87, sincronizada: false, animo: null, comentarioFamilia: "" },
];

/* Objetivos terapéuticos medibles. metrica: "puntaje" (promedio de las últimas 3), "constancia" (% del mes) o "zona" (% logrado en una zona de la pantalla). */
export const METAS = [
  { id: "m-1", pacienteId: "KN-0142", texto: "Sostener más del 90% con objetivos medianos", metrica: "puntaje", base: 52, objetivo: 90, fechaLimite: dia(-14) },
  { id: "m-2", pacienteId: "KN-0142", texto: "Jugar 5 veces por semana", metrica: "constancia", base: 0, objetivo: 100, fechaLimite: dia(-21) },
  { id: "m-3", pacienteId: "KN-0163", texto: "Alcanzar objetivos arriba a la izquierda", metrica: "zona", zona: "Arriba izq.", base: 20, objetivo: 80, fechaLimite: dia(-28) },
  { id: "m-4", pacienteId: "KN-0157", texto: "Llegar al 80% alternando manos", metrica: "puntaje", base: 45, objetivo: 80, fechaLimite: dia(-10) },
];

/* Mensajes entre profesional y familia (los ve también la app familiar). */
export const MENSAJES = [
  { id: "ms-1", pacienteId: "KN-0142", de: "profesional", autor: "Laura", texto: "¡Qué bien viene esta semana! Achicamos un poco los objetivos para que sea un desafío.", fecha: dia(6, 10, 5), leido: true },
  { id: "ms-2", pacienteId: "KN-0142", de: "familia", autor: "Familia de KN-0142", texto: "¡Gracias! Le encantan las estrellitas del final. Hoy quiso jugar dos veces.", fecha: dia(0, 19, 10), leido: false },
  { id: "ms-3", pacienteId: "KN-0157", de: "familia", autor: "Familia de KN-0157", texto: "Ayer terminó diciendo que le molestaba el brazo. ¿Seguimos igual o paramos un día?", fecha: dia(1, 20, 30), leido: false },
  { id: "ms-4", pacienteId: "KN-0163", de: "profesional", autor: "Laura", texto: "Vimos que la consola no se conecta. ¿Pueden revisar que el wifi esté encendido?", fecha: dia(1, 9, 0), leido: true },
  { id: "ms-5", pacienteId: "KN-0163", de: "familia", autor: "Familia de KN-0163", texto: "Cambiamos el router, mañana lo conectamos de nuevo.", fecha: dia(0, 8, 40), leido: true },
];

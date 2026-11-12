import { useEffect, useRef, useState } from "react";
import * as api from "./api.js";
import { CAP } from "./api.js";
import { reproducirSonidoMensaje } from "./sonido.js";

const INTERVALO = 5000; // cada 5s busca mensajes nuevos de la familia

/*
 * Mensajes sin leer de todos los pacientes de este profesional: suena al abrir el portal si ya
 * había mensajes esperando, y vuelve a sonar cada vez que aparece uno nuevo.
 * Solo corre si la capa de datos soporta mensajes (CAP.mensajes) — hoy, solo en el modo de diseño/demo.
 */
export function useNotificacionesMensajes(profesionalId) {
  const [pacientes, setPacientes] = useState([]); // [{id, codigo, etiqueta, sinLeer}]
  const anterior = useRef(null); // total de la última lectura, para saber si subió

  useEffect(() => {
    if (!CAP.mensajes || !profesionalId) return;
    let activo = true;

    const revisar = async () => {
      try {
        const data = await api.getPacientes(profesionalId);
        if (!activo) return;
        const conMensajes = data.filter((p) => p.sinLeer > 0).map((p) => ({ id: p.id, codigo: p.codigo, etiqueta: p.etiqueta, sinLeer: p.sinLeer }));
        const total = conMensajes.reduce((t, p) => t + p.sinLeer, 0);
        if (anterior.current !== null && total > anterior.current) reproducirSonidoMensaje(); // llegó algo nuevo
        else if (anterior.current === null && total > 0) reproducirSonidoMensaje(); // ya había al abrir
        anterior.current = total;
        setPacientes(conMensajes);
      } catch {
        /* si falla la consulta, no interrumpe el resto del portal */
      }
    };

    revisar();
    const id = setInterval(revisar, INTERVALO);
    return () => { activo = false; clearInterval(id); };
  }, [profesionalId]);

  const total = pacientes.reduce((t, p) => t + p.sinLeer, 0);
  return { total, pacientes };
}

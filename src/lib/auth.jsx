import { createContext, useContext, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import * as api from "./api.js";

const AuthCtx = createContext(null);
const KEY = "kinima-portal-sesion";

/* La sesión de prueba se guarda solo en esta pestaña. Con la API real, el token lo maneja el servidor (cookie segura). */
function leer() { try { return JSON.parse(sessionStorage.getItem(KEY)); } catch { return null; } }
function escribir(v) { try { v ? sessionStorage.setItem(KEY, JSON.stringify(v)) : sessionStorage.removeItem(KEY); } catch { /* sin almacenamiento */ } }

export function AuthProvider({ children }) {
  const [sesion, setSesion] = useState(leer);
  const entrar = async (email, password) => { const s = await api.login(email, password); setSesion(s); escribir(s); return s; };
  const salir = () => { setSesion(null); escribir(null); };
  return <AuthCtx.Provider value={{ profesional: sesion?.profesional || null, entrar, salir }}>{children}</AuthCtx.Provider>;
}

export const useAuth = () => useContext(AuthCtx);

export function RequireAuth({ children, admin = false }) {
  const { profesional } = useAuth();
  const loc = useLocation();
  if (!profesional) return <Navigate to="/ingresar" replace state={{ from: loc.pathname }} />;
  if (admin && profesional.rol !== "admin") return <Navigate to="/pacientes" replace />;
  return children;
}

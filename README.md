# Kinima · Portal profesional

Portal para que cada profesional inicie sesión, vea sus pacientes y consolas, asigne ejercicios y consulte resultados.
Dirección prevista: **portal.kinima.uy**.

> Versión de diseño: funciona con **datos de prueba** (`src/data/mock.js`). Ningún dato es real.
> Usuario de prueba: `demo@kinima.uy` · contraseña `kinima2026`.

## Correrlo
```bash
npm install
npm run dev     # http://localhost:5173
npm run build   # genera dist/
```

## Pantallas
| Ruta | Pantalla |
|---|---|
| `/ingresar` | Iniciar sesión |
| `/pacientes` | Lista de pacientes (por código interno), constancia semanal, filtros |
| `/pacientes/:id` | Ficha: puntaje por sesión, semana, asignación actual, notas, sesiones, historial |
| `/pacientes` (arriba) | **Para revisar hoy**: avisos de la familia, consolas sin conexión, días sin jugar, bajas de puntaje, sugerencias |
| `/pacientes/:id?tab=familia` | Mensajes con la familia y "cómo se sintió" después de cada sesión |
| `/pacientes/:id?tab=rutinas` | Historial de versiones de la rutina con el motivo de cada cambio |
| `/pacientes/:id/informe` | Informe imprimible / "Guardar como PDF" por período |
| `/asignar` | Nueva rutina en 4 pasos: paciente → días + ejercicios (hasta 3) o plantilla → consola → confirmar |
| `/ejercicios` | Biblioteca de ejercicios con demostración animada (se reemplaza por video en `VIDEOS`) |
| `/consolas` | Estado de cada Raspberry, última sincronización, sesiones pendientes |
| `/profesionales` | Solo admin: habilitar o retirar acceso |

## Funciones clínicas
- **Sugerencias de ajuste**: si las últimas 3 sesiones con la rutina actual superan 85% se propone más dificultad; si quedan bajo 45%, menos. Nunca se aplican solas.
- **Cambios marcados en la curva**: cada versión de rutina aparece como línea punteada (v2, v3…).
- **Objetivos terapéuticos**: metas medibles por puntaje, constancia o alcance en una zona, con plazo y barra de avance.
- **Familia**: mensajes y ánimo después de jugar (😄 🙂 😴 😣). Si marcan "le molestó", aparece arriba en "Para revisar hoy".

## Conectar con la API central
Todo pasa por `src/lib/api.js`. Hoy devuelve datos de prueba; para conectarlo a la API (por ejemplo `https://central.kinima.uy`)
se reemplaza cada función por un `fetch` a la ruta correspondiente, devolviendo los mismos campos. Las pantallas no cambian.

- El portal **nunca** guarda contraseñas de la base de datos ni secretos: solo habla con la API.
- La API tiene que permitir pedidos desde `https://portal.kinima.uy` (CORS) y manejar la sesión (idealmente con cookie segura).

## Publicar
Proyecto separado de la web pública: repo propio en GitHub → proyecto nuevo en Vercel → dominio `portal.kinima.uy`.
`vercel.json` hace que las rutas funcionen al recargar.

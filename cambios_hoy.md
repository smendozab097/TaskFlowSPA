# Cambios de Hoy

## Mejoras de Interfaz (UX) y Micro-animaciones
- Se devolvió la interactividad y feedback visual a todos los botones, enlaces y tarjetas de la SPA.
- Se implementaron micro-animaciones usando clases como `hover:scale-[1.03]`, `active:scale-95` y `hover:-translate-y-1` para dar una sensación fluida y viva.
- Se corrigió el dropdown de la vista Admin que había perdido interactividad.

## Implementación de Modo Oscuro (Dark Mode)
- **Configuración de Tailwind**: Se configuró la variante manual `dark:` en `src/styles/global.css`.
- **Interruptor y Persistencia**: Se añadió un toggle (Sol/Luna) en `Header.js` que cambia la clase `.dark` del elemento HTML y guarda la preferencia en `localStorage`.
- **Migración de Colores Global**: Se ajustaron las clases de fondo, texto, borde y sombra (ej. `dark:bg-slate-800`, `dark:text-slate-100`) en todas y cada una de las vistas:
  - `home.js`, `dashboard.js`, `tasks.js`, `task-form.js`, `profile.js`, `admin.js`, `login.js`, `register.js`.
- **Prevención de Destellos Blancos**: Se inyectó un pequeño script en `index.html` para aplicar el tema guardado instantáneamente antes de la renderización del contenido.
- **Soporte Global para Alertas (SweetAlert)**: Se modificó la base de `Swal.fire` en `src/utils/alerts.js` para que adopte automáticamente una paleta de colores oscuros (`bg: #1e293b`, `color: #f1f5f9`) si el modo oscuro está activo, sin requerir cambiar las invocaciones individuales.

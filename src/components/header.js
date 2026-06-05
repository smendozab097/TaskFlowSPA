import { getSession, deleteSession } from '../services/auth.service.js';
import { initThemeToggle } from '../utils/theme.js';
import Swal from 'sweetalert2';

// ----------------------------------------
// RENDERIZAR CABECERA
// Genera dinámicamente el HTML del menú de 
// navegación superior según la sesión.
// ----------------------------------------
export function renderHeader() {
  const user = getSession();
  const currentPath = window.location.pathname;

  let navLinks = '';

  // Determina qué enlaces mostrar si el usuario está logueado
  if (user) {
    const isAdmin = user.role && user.role.includes('ADMIN');
    navLinks = `
      <a class="rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-300 ${currentPath === '/' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-blue-50 hover:text-blue-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-blue-400'}" href="/" data-link>Inicio</a>
      <a class="rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-300 ${currentPath === '/dashboard' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-blue-50 hover:text-blue-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-blue-400'}" href="/dashboard" data-link>Dashboard</a>
      <a class="rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-300 ${currentPath === '/tasks' || currentPath === '/task-form' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-blue-50 hover:text-blue-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-blue-400'}" href="/tasks" data-link>Tareas</a>
      <a class="rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-300 ${currentPath === '/profile' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-blue-50 hover:text-blue-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-blue-400'}" href="/profile" data-link>Perfil</a>
      ${isAdmin ? `<a class="rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-300 ${currentPath === '/admin' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-blue-50 hover:text-blue-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-blue-400'}" href="/admin" data-link>Admin</a>` : ''}
      <button id="logout-btn" class="rounded-full px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30 transition-colors duration-300 cursor-pointer active:scale-95 hover:text-rose-900 dark:hover:text-red-300">Logout</button>
    `;
  } else {
    navLinks = `
      <a class="rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-300 ${currentPath === '/' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-blue-50 hover:text-blue-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-blue-400'}" href="/" data-link>Inicio</a>
      <a class="rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-300 ${currentPath === '/login' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-blue-50 hover:text-blue-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-blue-400'}" href="/login" data-link>Login</a>
      <a class="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 transition-colors duration-300 active:scale-95" href="/register" data-link>Registrarse</a>
    `;
  }

  return `
    <header class="border-b border-blue-100 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 shadow-md backdrop-blur sticky top-0 z-50 transition-colors duration-300">
      <div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a class="text-xl font-black tracking-tight text-blue-800 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-300" href="/" data-link>TaskFlowSPA</a>
        <nav class="hidden items-center gap-3 md:flex">
          ${navLinks}
          <button id="theme-toggle" class="ml-2 rounded-full p-2 text-slate-600 hover:bg-blue-50 hover:text-blue-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-blue-400 transition-colors duration-300 cursor-pointer" aria-label="Toggle Dark Mode">
            <svg class="w-5 h-5 hidden dark:block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
            <svg class="w-5 h-5 block dark:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
          </button>
        </nav>
      </div>
    </header>
  `;
}

// ----------------------------------------
// INICIALIZACIÓN DE LA CABECERA (initHeader)
// Asigna eventos a los botones del menú una
// vez que el HTML está inyectado en el DOM.
// ----------------------------------------
export function initHeader() {
  // Inicializa el evento del botón de modo oscuro (importado desde utils/theme.js)
  initThemeToggle();

  // Inicializa el evento del botón de cerrar sesión
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      // Muestra alerta de confirmación
      const result = await Swal.fire({
        title: '¿Cerrar sesión?',
        text: '¿Estás seguro de que deseas cerrar sesión?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#94a3b8',
        confirmButtonText: 'Sí, cerrar',
        cancelButtonText: 'Cancelar'
      });
      // Si el usuario confirma, se elimina la sesión y redirige al inicio
      if (result.isConfirmed) {
        deleteSession();
        history.pushState(null, null, '/');
        window.dispatchEvent(new Event('popstate'));
      }
    });
  }
}

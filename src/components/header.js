import { getSession, deleteSession } from '../services/auth.service.js';
import Swal from 'sweetalert2';

export function renderHeader() {
  const user = getSession();
  const currentPath = window.location.pathname;

  let navLinks = '';

  if (user) {
    const isAdmin = user.role && user.role.includes('ADMIN');
    navLinks = `
      <a class="rounded-full px-4 py-2 text-sm font-semibold ${currentPath === '/' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-blue-50 hover:text-blue-700'}" href="/" data-link>Inicio</a>
      <a class="rounded-full px-4 py-2 text-sm font-semibold ${currentPath === '/dashboard' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-blue-50 hover:text-blue-700'}" href="/dashboard" data-link>Dashboard</a>
      <a class="rounded-full px-4 py-2 text-sm font-semibold ${currentPath === '/tasks' || currentPath === '/task-form' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-blue-50 hover:text-blue-700'}" href="/tasks" data-link>Tareas</a>
      <a class="rounded-full px-4 py-2 text-sm font-semibold ${currentPath === '/profile' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-blue-50 hover:text-blue-700'}" href="/profile" data-link>Perfil</a>
      ${isAdmin ? `<a class="rounded-full px-4 py-2 text-sm font-semibold ${currentPath === '/admin' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-blue-50 hover:text-blue-700'}" href="/admin" data-link>Admin</a>` : ''}
      <button id="logout-btn" class="rounded-full px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 cursor-pointer">Logout</button>
    `;
  } else {
    navLinks = `
      <a class="rounded-full px-4 py-2 text-sm font-semibold ${currentPath === '/' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-blue-50 hover:text-blue-700'}" href="/" data-link>Inicio</a>
      <a class="rounded-full px-4 py-2 text-sm font-semibold ${currentPath === '/login' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-blue-50 hover:text-blue-700'}" href="/login" data-link>Login</a>
      <a class="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500" href="/register" data-link>Registrarse</a>
    `;
  }

  return `
    <header class="border-b border-blue-100 bg-white/90 backdrop-blur sticky top-0 z-50">
      <div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a class="text-xl font-black tracking-tight text-blue-900 hover:text-blue-700" href="/" data-link>TaskFlowSPA</a>
        <nav class="hidden items-center gap-3 md:flex">
          ${navLinks}
        </nav>
      </div>
    </header>
  `;
}

export function initHeader() {
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async (e) => {
      e.preventDefault();
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
      
      if (result.isConfirmed) {
        deleteSession();
        history.pushState(null, null, '/');
        window.dispatchEvent(new Event('popstate'));
      }
    });
  }
}

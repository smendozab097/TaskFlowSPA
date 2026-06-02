import { getSession } from '../services/auth.service.js';
import { renderHeader, initHeader } from '../components/header.js';
import { getTasks } from '../services/tasks.service.js';

export const renderDashboard = () => {
    return `
    ${renderHeader()}
    
    <main class="mx-auto max-w-6xl px-6 py-10">
      <section class="rounded-[2rem] bg-blue-600 px-8 py-10 text-white shadow-xl shadow-blue-100">
        <p class="text-sm font-semibold uppercase tracking-[0.3em] text-blue-100">Dashboard principal</p>
        <h1 id="welcome-heading" class="mt-3 text-4xl font-black tracking-tight">Bienvenido.</h1>
        <p class="mt-4 max-w-2xl text-blue-50">Resumen general del trabajo del usuario, accesos rápidos y estado actual de productividad.</p>
      </section>

      <section class="mt-8 grid gap-4 md:grid-cols-3">
        <article class="rounded-3xl border border-blue-100 bg-white p-6 shadow-lg shadow-blue-50">
          <p class="text-sm text-slate-500">Tareas activas</p>
          <p id="active-tasks-count" class="mt-3 text-4xl font-black text-blue-700">...</p>
        </article>
        <article class="rounded-3xl border border-blue-100 bg-white p-6 shadow-lg shadow-blue-50">
          <p class="text-sm text-slate-500">Completadas</p>
          <p id="completed-tasks-count" class="mt-3 text-4xl font-black text-blue-700">...</p>
        </article>
        <article class="rounded-3xl border border-blue-100 bg-white p-6 shadow-lg shadow-blue-50">
          <p class="text-sm text-slate-500">Pendientes hoy</p>
          <p id="pending-tasks-count" class="mt-3 text-4xl font-black text-blue-700">...</p>
        </article>
      </section>

      <section class="mt-8">
        <article class="rounded-3xl border border-blue-100 bg-white p-6 shadow-lg shadow-blue-50">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-bold text-slate-900">Accesos rápidos</h2>
            <a class="text-sm font-semibold text-blue-700 hover:text-blue-600" href="/tasks" data-link>Ver tareas</a>
          </div>
          <div class="mt-6 grid gap-4 sm:grid-cols-2">
            <a class="rounded-3xl bg-blue-50 p-5 hover:bg-blue-100" href="/task-form" data-link>
              <p class="text-sm font-semibold text-blue-600">Crear</p>
              <h3 class="mt-2 text-lg font-bold text-slate-900">Nueva tarea</h3>
            </a>
            <a class="rounded-3xl bg-blue-50 p-5 hover:bg-blue-100" href="/profile" data-link>
              <p class="text-sm font-semibold text-blue-600">Cuenta</p>
              <h3 class="mt-2 text-lg font-bold text-slate-900">Editar perfil</h3>
            </a>
          </div>
        </article>
      </section>
    </main>
    `;
}

export async function initDashboard() {
  initHeader();

  const welcomeHeading = document.getElementById('welcome-heading');
  const activeTasksCount = document.getElementById('active-tasks-count');
  const completedTasksCount = document.getElementById('completed-tasks-count');
  const pendingTasksCount = document.getElementById('pending-tasks-count');

  const user = getSession();

  if (user) {
    if (welcomeHeading && user.name) {
      welcomeHeading.textContent = `Bienvenido, ${user.name}.`;
    }
    
    try {
      const isAdmin = user.role && user.role.includes('ADMIN');
      const tasks = isAdmin ? await getTasks() : await getTasks(user.id);
      
      const total = tasks.length;
      const completed = tasks.filter(t => t.status === 'Completada').length;
      const pending = total - completed;
      
      if (activeTasksCount) activeTasksCount.textContent = total;
      if (completedTasksCount) completedTasksCount.textContent = completed;
      if (pendingTasksCount) pendingTasksCount.textContent = pending;
      
    } catch (error) {
      console.error('Error al cargar las tareas para el dashboard:', error);
      if (activeTasksCount) activeTasksCount.textContent = '-';
      if (completedTasksCount) completedTasksCount.textContent = '-';
      if (pendingTasksCount) pendingTasksCount.textContent = '-';
    }
    
  } else {
    console.warn('No hay ninguna sesión activa.');
  }
}
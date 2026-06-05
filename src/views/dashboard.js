import { getSession } from '../services/auth.service.js';
import { renderHeader, initHeader } from '../components/header.js';
import { getTasks } from '../services/tasks.service.js';

export const renderDashboard = () => {
    return `
    ${renderHeader()}
    
    <main class="mx-auto max-w-6xl px-6 py-10">
      <section class="rounded-[2rem] bg-blue-600 dark:bg-slate-800 border dark:border-slate-700 px-8 py-10 text-white shadow-lg shadow-blue-300 dark:shadow-black/50 transition-colors duration-300">
        <p class="text-sm font-semibold uppercase tracking-[0.3em] text-blue-100 dark:text-blue-300">Dashboard principal</p>
        <h1 id="welcome-heading" class="mt-3 text-4xl font-black tracking-tight dark:text-white">Bienvenido.</h1>
        <p class="mt-4 max-w-2xl text-blue-50 dark:text-slate-300">Resumen general del trabajo del usuario, accesos rápidos y estado actual de productividad.</p>
      </section>

      <section class="mt-8 grid gap-4 md:grid-cols-3">
        <article class="rounded-3xl border border-blue-400 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-lg shadow-blue-200 dark:shadow-black/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
          <p class="text-sm text-slate-500 dark:text-slate-400">Tareas activas</p>
          <p id="active-tasks-count" class="mt-3 text-4xl font-black text-blue-700 dark:text-blue-400">...</p>
        </article>
        <article class="rounded-3xl border border-blue-400 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-lg shadow-blue-200 dark:shadow-black/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
          <p class="text-sm text-slate-500 dark:text-slate-400">Completadas</p>
          <p id="completed-tasks-count" class="mt-3 text-4xl font-black text-blue-700 dark:text-blue-400">...</p>
        </article>
        <article class="rounded-3xl border border-blue-400 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-lg shadow-blue-200 dark:shadow-black/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
          <p class="text-sm text-slate-500 dark:text-slate-400">Pendientes hoy</p>
          <p id="pending-tasks-count" class="mt-3 text-4xl font-black text-blue-700 dark:text-blue-400">...</p>
        </article>
      </section>

      <section class="mt-8">
        <article class="rounded-3xl border border-blue-400 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-lg shadow-blue-200 dark:shadow-black/40 transition-all duration-300 hover:shadow-xl">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-bold text-slate-900 dark:text-slate-100">Accesos rápidos</h2>
            <a class="text-sm font-semibold text-blue-700 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 transition-colors duration-200" href="/tasks" data-link>Ver tareas</a>
          </div>
          <div class="mt-6 grid gap-4 sm:grid-cols-2">
            <a class="rounded-3xl bg-blue-50 dark:bg-slate-700 p-5 hover:bg-blue-100 dark:hover:bg-slate-600 transition-all duration-300 hover:-translate-y-1 hover:shadow-blue-400/50 dark:hover:shadow-black/50 shadow-md border border-blue-200 dark:border-slate-600 cursor-pointer block" href="/task-form" data-link onclick="sessionStorage.removeItem('editTaskId')">
              <p class="text-sm font-semibold text-blue-600 dark:text-blue-400">Crear</p>
              <h3 class="mt-2 text-lg font-bold text-slate-900 dark:text-slate-100">Nueva tarea</h3>
            </a>
            <a class="rounded-3xl bg-blue-50 dark:bg-slate-700 p-5 hover:bg-blue-100 dark:hover:bg-slate-600 transition-all duration-300 hover:-translate-y-1 hover:shadow-blue-400/50 dark:hover:shadow-black/50 shadow-md border border-blue-200 dark:border-slate-600 cursor-pointer block" href="/profile" data-link>
              <p class="text-sm font-semibold text-blue-600 dark:text-blue-400">Cuenta</p>
              <h3 class="mt-2 text-lg font-bold text-slate-900 dark:text-slate-100">Editar perfil</h3>
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
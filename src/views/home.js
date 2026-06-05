import { renderHeader, initHeader } from '../components/header.js';
import { getSession } from '../services/auth.service.js';

export function renderHome() {
  const user = getSession();

  let callToAction = '';
  if (user) {
    callToAction = `
      <div class="mt-8 flex flex-col gap-3 sm:flex-row">
        <a class="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-200 dark:shadow-black/50 hover:bg-blue-500 transition-all duration-300 hover:scale-[1.03] hover:shadow-xl active:scale-95" href="/dashboard" data-link>Ir a mi Dashboard</a>
      </div>
    `;
  } else {
    callToAction = `
      <div class="mt-8 flex flex-col gap-3 sm:flex-row">
        <a class="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-200 dark:shadow-black/50 hover:bg-blue-500 dark:hover:bg-blue-500 transition-all duration-300 hover:scale-[1.03] hover:shadow-xl active:scale-95" href="/login" data-link>Iniciar sesion</a>
        <a class="inline-flex items-center justify-center rounded-2xl border border-blue-200 dark:border-slate-600 bg-white dark:bg-slate-800 px-6 py-3 text-sm font-bold text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-700 transition-all duration-300 hover:scale-[1.03] active:scale-95" href="/register" data-link>Crear cuenta</a>
      </div>
    `;
  }

  return `
    ${renderHeader()}

    <main class="mx-auto max-w-6xl px-6 py-14">
      <section class="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div>
          <p class="inline-flex rounded-full bg-blue-100 dark:bg-slate-800 px-4 py-2 text-sm font-semibold text-blue-700 dark:text-blue-400">Organiza tu trabajo con calma</p>
          <h1 class="mt-6 text-5xl font-black tracking-tight text-slate-900 dark:text-slate-100 sm:text-6xl">
            Una plataforma clara para gestionar tareas, usuarios y productividad.
          </h1>
          <p class="mt-5 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
            TaskFlowSPA presenta el recorrido principal del proyecto con una interfaz uniforme, amable y lista para convertirse
            luego en una SPA real con autenticacion, roles, permisos y CRUD de tareas.
          </p>
          ${callToAction}
        </div>

        <section class="rounded-[2rem] border border-blue-100 dark:border-slate-700 bg-white dark:bg-slate-800 p-8 shadow-xl shadow-blue-100/70 dark:shadow-black/40">
          <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-100">Vistas del proyecto</h2>
          <div class="mt-6 grid gap-4 sm:grid-cols-2">
            <a class="rounded-3xl bg-blue-100 dark:bg-slate-700/50 p-5 shadow-blue-200 dark:shadow-black/30 shadow-lg hover:bg-blue-200/70 dark:hover:bg-slate-700 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer block" href="/dashboard" data-link>
              <p class="text-sm font-semibold text-blue-600 dark:text-blue-400">Dashboard</p>
              <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">Resumen principal de productividad.</p>
            </a>
            <a class="rounded-3xl bg-blue-100 dark:bg-slate-700/50 p-5 shadow-blue-200 dark:shadow-black/30 shadow-lg hover:bg-blue-200/70 dark:hover:bg-slate-700 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer block" href="/tasks" data-link>
              <p class="text-sm font-semibold text-blue-600 dark:text-blue-400">Mis tareas</p>
              <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">CRUD principal del usuario.</p>
            </a>
            <a class="rounded-3xl bg-blue-100 dark:bg-slate-700/50 p-5 shadow-blue-200 dark:shadow-black/30 shadow-lg hover:bg-blue-200/70 dark:hover:bg-slate-700 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer block" href="/profile" data-link>
              <p class="text-sm font-semibold text-blue-600 dark:text-blue-400">Mi perfil</p>
              <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">Actualizar cuenta y datos personales.</p>
            </a>
            <a class="rounded-3xl bg-blue-100 dark:bg-slate-700/50 p-5 shadow-blue-200 dark:shadow-black/30 shadow-lg hover:bg-blue-200/70 dark:hover:bg-slate-700 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer block" href="/admin" data-link>
              <p class="text-sm font-semibold text-blue-600 dark:text-blue-400">Admin</p>
              <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">Gestion de usuarios y roles.</p>
            </a>
          </div>
        </section>
      </section>
    </main>
  `;
}

export function initHome() {
  initHeader();
}
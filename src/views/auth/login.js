import { getUsers } from '../../services/users.service.js';
import { createSession } from '../../services/auth.service.js';
import Swal from 'sweetalert2';

export const renderLogin = () => {
  return `
    <main class="grid min-h-screen lg:grid-cols-[1fr_0.95fr]">
      <section class="flex items-center justify-center px-6 py-10">
        <div class="w-full max-w-xl rounded-[2rem] border border-blue-100 dark:border-slate-700 bg-white dark:bg-slate-800 p-8 shadow-xl shadow-blue-100/70 dark:shadow-black/40 transition-colors duration-300">
          <div class="flex items-center justify-between">
            <a class="text-xl font-black tracking-tight text-blue-900 dark:text-blue-400" href="/" data-link>TaskFlowSPA</a>
            <a class="rounded-full border border-blue-200 dark:border-slate-600 px-4 py-2 text-sm font-semibold text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-700 transition-all duration-300 hover:scale-[1.03] active:scale-95" href="/register" data-link>Registrarse</a>
          </div>

          <div class="mt-8">
            <p class="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600 dark:text-blue-400">Inicio de sesion</p>
            <h1 class="mt-2 text-4xl font-black tracking-tight text-slate-900 dark:text-slate-100">Bienvenido de nuevo</h1>
            <p class="mt-4 text-slate-600 dark:text-slate-300">Ingresa a tu espacio de trabajo y continua organizando tus tareas.</p>
          </div>

          <form id="login-form" class="mt-8 grid gap-5">
            <div>
              <label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200" for="email">Correo</label>
              <input id="email" name="email" type="email" placeholder="usuario@taskflow.com" required class="w-full rounded-2xl border border-blue-100 dark:border-slate-600 bg-blue-50 dark:bg-slate-700 px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none transition-all duration-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent" />
            </div>
            <div>
              <label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200" for="password">Contrasena</label>
              <input id="password" name="password" type="password" placeholder="Ingresa tu contrasena" required class="w-full rounded-2xl border border-blue-100 dark:border-slate-600 bg-blue-50 dark:bg-slate-700 px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none transition-all duration-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent" />
            </div>
            <button type="submit" class="w-full inline-flex items-center justify-center rounded-2xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-500 cursor-pointer transition-all duration-300 hover:scale-[1.03] active:scale-95 hover:shadow-lg dark:shadow-black/50">
              Entrar al dashboard
            </button>
          </form>
        </div>
      </section>

      <section class="hidden bg-blue-600 dark:bg-slate-900 transition-colors duration-300 p-10 text-white lg:flex lg:flex-col lg:justify-center">
        <div class="mx-auto max-w-lg">
          <p class="text-sm font-semibold uppercase tracking-[0.3em] text-blue-100 dark:text-blue-300">TaskFlowSPA</p>
          <h2 class="mt-4 text-5xl font-black tracking-tight">Una experiencia limpia para aprender una primera SPA.</h2>
          <ul class="mt-8 space-y-4 text-lg leading-8 text-blue-50 dark:text-slate-300">
            <li>Autenticacion simplificada con localStorage.</li>
            <li>Gestion de tareas con enfoque claro y visual.</li>
            <li>Roles y permisos entendibles desde el primer recorrido.</li>
          </ul>
        </div>
      </section>
    </main>`;
}

export function initLogin() {
  const loginForm = document.getElementById('login-form');

  if (loginForm) {
    loginForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const data = new FormData(loginForm);
      const email = data.get('email').trim().toLowerCase();
      const password = data.get('password');

      console.log('Intentando iniciar sesion con:', email);

      try {
        const users = await getUsers();
        const userMatch = users.find(u => u.email === email && u.password === password);

        if (userMatch) {
          console.log('Login exitoso:', userMatch);

          // Guardamos la sesion activa usando el servicio
          createSession(userMatch);

          loginForm.reset();

          history.pushState(null, null, '/dashboard');
          window.dispatchEvent(new Event('popstate'));

        } else {
          console.error('Credenciales incorrectas');
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Correo o contrasena incorrectos. Intentalo de nuevo.'
          });
        }
      } catch (error) {
        console.error('Error al conectar con la API:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error de conexión',
          text: 'Hubo un problema de conexion. Asegurate de que el servidor este encendido.'
        });
      }
    });
  }
}

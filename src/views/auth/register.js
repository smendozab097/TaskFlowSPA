import { createUser } from "../../services/users.service.js";
import { createSession } from "../../services/auth.service.js";
import Swal from 'sweetalert2';

// ----------------------------------------
// VISTA DE REGISTRO
// Genera el formulario para registrar un nuevo usuario y procesa la creación.
// ----------------------------------------

export function renderRegister() {
  // Retorna el HTML del formulario de registro
  return `
    <main class="grid min-h-screen lg:grid-cols-[0.95fr_1.05fr]">
      <section class="hidden border-r border-blue-100 dark:border-transparent bg-blue-600 dark:bg-slate-900 transition-colors duration-300 p-10 text-white lg:flex lg:flex-col lg:justify-between">
        <a class="text-xl font-black tracking-tight" href="/" data-link>TaskFlowSPA</a>
        <div>
          <p class="text-sm font-semibold uppercase tracking-[0.3em] text-blue-100 dark:text-blue-300">Nuevo usuario</p>
          <h1 class="mt-4 text-5xl font-black tracking-tight">Crea tu cuenta y empieza a organizar tu flujo.</h1>
          <p class="mt-5 max-w-md text-lg leading-8 text-blue-50 dark:text-slate-300">
            Esta vista permite enseñar el registro como parte del alcance funcional antes de llevarlo al flujo SPA definitivo.
          </p>
        </div>
        <p class="text-sm text-blue-100 dark:text-blue-300">Interfaz base del modulo de autenticacion.</p>
      </section>

      <section class="flex items-center justify-center px-6 py-10">
        <div class="w-full max-w-xl rounded-[2rem] border border-blue-100 dark:border-slate-700 bg-white dark:bg-slate-800 p-8 shadow-xl shadow-blue-100/70 dark:shadow-black/40 transition-colors duration-300">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600 dark:text-blue-400">Registro</p>
              <h2 class="mt-2 text-3xl font-black text-slate-900 dark:text-slate-100">Crear cuenta</h2>
            </div>
            <a class="rounded-full border border-blue-200 dark:border-slate-600 px-4 py-2 text-sm font-semibold text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-700 transition-all duration-300 hover:scale-[1.03] active:scale-95" href="/login" data-link>Ya tengo cuenta</a>
          </div>

          <form id="register-form" class="mt-8 grid gap-5">
            <div class="grid gap-5 md:grid-cols-2">
              <div>
                <label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200" for="register-name">Nombre</label>
                <input id="register-name" name="name" type="text" placeholder="Ana" required class="w-full rounded-2xl border border-blue-100 dark:border-slate-600 bg-blue-50 dark:bg-slate-700 px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none transition-all duration-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent" />
              </div>
              <div>
                <label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200" for="register-lastname">Apellido</label>
                <input id="register-lastname" name="lastname" type="text" placeholder="Torres" required class="w-full rounded-2xl border border-blue-100 dark:border-slate-600 bg-blue-50 dark:bg-slate-700 px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none transition-all duration-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent" />
              </div>
            </div>

            <div>
              <label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200" for="register-email">Correo</label>
              <input id="register-email" name="email" type="email" placeholder="usuario@taskflow.com" required class="w-full rounded-2xl border border-blue-100 dark:border-slate-600 bg-blue-50 dark:bg-slate-700 px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none transition-all duration-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent" />
            </div>

            <div class="grid gap-5 md:grid-cols-2">
              <div>
                <label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200" for="register-password">Contrasena</label>
                <input id="register-password" name="password" type="password" placeholder="Crea una contrasena" required class="w-full rounded-2xl border border-blue-100 dark:border-slate-600 bg-blue-50 dark:bg-slate-700 px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none transition-all duration-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent" />
              </div>
              <div>
                <label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200" for="register-role">Rol</label>
                <select id="register-role" name="role" class="w-full rounded-2xl border border-blue-100 dark:border-slate-600 bg-blue-50 dark:bg-slate-700 px-4 py-3 text-slate-900 dark:text-white focus:outline-none transition-all duration-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent cursor-pointer">
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>
            </div>

            <button type="submit" class="w-full inline-flex items-center justify-center rounded-2xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-500 cursor-pointer transition-all duration-300 hover:scale-[1.03] active:scale-95 hover:shadow-lg dark:shadow-black/50">
              Registrarme
            </button>
          </form>
        </div>
      </section>
    </main>
  `;
}

// ----------------------------------------
// INICIALIZAR REGISTRO
// Escucha el envío del formulario, genera un nuevo usuario, lo guarda y crea la sesión.
// ----------------------------------------
export function initRegister() {
  const registerForm = document.getElementById('register-form');

  if (registerForm) {
    registerForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      // Recolectamos los datos y construimos el objeto de nuevo usuario
      const data = new FormData(registerForm);

      const newUser = {
        id: crypto.randomUUID(), // Generamos un ID único falso
        name: data.get('name').trim(),
        lastname: data.get('lastname').trim(),
        email: data.get('email').trim().toLowerCase(),
        password: data.get('password'),
        role: [data.get('role')] // Array para soportar múltiples roles en el futuro
      };

      try {
        // Guardamos el nuevo usuario a través del servicio
        await createUser(newUser);

        // Limpiamos el formulario
        registerForm.reset();

        // Logueamos automáticamente al usuario
        createSession(newUser);

        // Notificación de éxito y redirección al dashboard
        Swal.fire({
          icon: 'success',
          title: '¡Bienvenido!',
          text: 'Registro exitoso e inicio de sesión automático.',
          timer: 2000,
          showConfirmButton: false
        }).then(() => {
          history.pushState(null, null, '/dashboard');
          window.dispatchEvent(new Event('popstate'));
        });

      } catch (error) {
        // ----------------------------------------
        // ERROR DE REGISTRO
        // ----------------------------------------
        console.error('Error al registrar usuario:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrio un problema al registrar la cuenta.'
        });
      }
    });
  }
}

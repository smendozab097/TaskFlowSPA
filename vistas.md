home.js
```
<main class="mx-auto max-w-6xl px-6 py-14">
      <section class="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div>
          <p class="inline-flex rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">Organiza tu trabajo con calma</p>
          <h1 class="mt-6 text-5xl font-black tracking-tight text-slate-900 sm:text-6xl">
            Una plataforma clara para gestionar tareas, usuarios y productividad.
          </h1>
          <p class="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            TaskFlowSPA presenta el recorrido principal del proyecto con una interfaz uniforme, amable y lista para convertirse
            luego en una SPA real con autenticacion, roles, permisos y CRUD de tareas.
          </p>
          <div class="mt-8 flex flex-col gap-3 sm:flex-row">
            <a class="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-200 hover:bg-blue-500" href="/src/views/login.html">Iniciar sesion</a>
            <a class="inline-flex items-center justify-center rounded-2xl border border-blue-200 bg-white px-6 py-3 text-sm font-bold text-blue-700 hover:bg-blue-50" href="/src/views/register.html">Crear cuenta</a>
          </div>
        </div>

        <section class="rounded-[2rem] border border-blue-100 bg-white p-8 shadow-xl shadow-blue-100/70">
          <h2 class="text-2xl font-bold text-slate-900">Vistas del proyecto</h2>
          <div class="mt-6 grid gap-4 sm:grid-cols-2">
            <a class="rounded-3xl bg-sky-50 p-5 hover:bg-sky-100" href="/src/views/dashboard.html">
              <p class="text-sm font-semibold text-blue-600">Dashboard</p>
              <p class="mt-2 text-sm text-slate-600">Resumen principal de productividad.</p>
            </a>
            <a class="rounded-3xl bg-sky-50 p-5 hover:bg-sky-100" href="/src/views/tasks.html">
              <p class="text-sm font-semibold text-blue-600">Mis tareas</p>
              <p class="mt-2 text-sm text-slate-600">CRUD principal del usuario.</p>
            </a>
            <a class="rounded-3xl bg-sky-50 p-5 hover:bg-sky-100" href="/src/views/profile.html">
              <p class="text-sm font-semibold text-blue-600">Mi perfil</p>
              <p class="mt-2 text-sm text-slate-600">Actualizar cuenta y datos personales.</p>
            </a>
            <a class="rounded-3xl bg-sky-50 p-5 hover:bg-sky-100" href="/src/views/admin.html">
              <p class="text-sm font-semibold text-blue-600">Admin</p>
              <p class="mt-2 text-sm text-slate-600">Gestion de usuarios y roles.</p>
            </a>
          </div>
        </section>
      </section>
    </main>
```


dashboard.js
```
<main class="mx-auto max-w-6xl px-6 py-10">
      <section class="rounded-[2rem] bg-blue-600 px-8 py-10 text-white shadow-xl shadow-blue-100">
        <p class="text-sm font-semibold uppercase tracking-[0.3em] text-blue-100">Dashboard principal</p>
        <h1 class="mt-3 text-4xl font-black tracking-tight">Bienvenida, Ana.</h1>
        <p class="mt-4 max-w-2xl text-blue-50">Resumen general del trabajo del usuario, accesos rapidos y estado actual de productividad.</p>
      </section>

      <section class="mt-8 grid gap-4 md:grid-cols-3">
        <article class="rounded-3xl border border-blue-100 bg-white p-6 shadow-lg shadow-blue-50">
          <p class="text-sm text-slate-500">Tareas activas</p>
          <p class="mt-3 text-4xl font-black text-blue-700">12</p>
        </article>
        <article class="rounded-3xl border border-blue-100 bg-white p-6 shadow-lg shadow-blue-50">
          <p class="text-sm text-slate-500">Completadas</p>
          <p class="mt-3 text-4xl font-black text-blue-700">28</p>
        </article>
        <article class="rounded-3xl border border-blue-100 bg-white p-6 shadow-lg shadow-blue-50">
          <p class="text-sm text-slate-500">Pendientes hoy</p>
          <p class="mt-3 text-4xl font-black text-blue-700">4</p>
        </article>
      </section>

      <section class="mt-8">
        <article class="rounded-3xl border border-blue-100 bg-white p-6 shadow-lg shadow-blue-50">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-bold text-slate-900">Accesos rapidos</h2>
            <a class="text-sm font-semibold text-blue-700 hover:text-blue-600" href="/src/views/tasks.html">Ver tareas</a>
          </div>
          <div class="mt-6 grid gap-4 sm:grid-cols-2">
            <a class="rounded-3xl bg-blue-50 p-5 hover:bg-blue-100" href="/src/views/task-form.html">
              <p class="text-sm font-semibold text-blue-600">Crear</p>
              <h3 class="mt-2 text-lg font-bold text-slate-900">Nueva tarea</h3>
            </a>
            <a class="rounded-3xl bg-blue-50 p-5 hover:bg-blue-100" href="/src/views/profile.html">
              <p class="text-sm font-semibold text-blue-600">Cuenta</p>
              <h3 class="mt-2 text-lg font-bold text-slate-900">Editar perfil</h3>
            </a>
          </div>
        </article>
      </section>
    </main>
```


admin.js
```
<main class="mx-auto max-w-7xl px-6 py-10">
      <section class="rounded-[2rem] bg-blue-600 px-8 py-10 text-white shadow-xl shadow-blue-100">
        <p class="text-sm font-semibold uppercase tracking-[0.3em] text-blue-100">Rol administrador</p>
        <h1 class="mt-3 text-4xl font-black tracking-tight">Panel administrativo</h1>
        <p class="mt-4 max-w-2xl text-blue-50">Vista reservada para gestionar usuarios, roles, permisos y monitoreo general del sistema.</p>
      </section>

      <section class="mt-8 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <article class="rounded-3xl border border-blue-100 bg-white p-6 shadow-lg shadow-blue-50">
          <h2 class="text-xl font-bold text-slate-900">Acciones rapidas</h2>
          <div class="mt-5 grid gap-4">
            <a class="rounded-2xl bg-blue-50 px-5 py-4 text-sm font-semibold text-blue-700 hover:bg-blue-100" href="/src/views/admin.html">Gestionar usuarios</a>
            <a class="rounded-2xl bg-blue-50 px-5 py-4 text-sm font-semibold text-blue-700 hover:bg-blue-100" href="/src/views/tasks.html">Ver todas las tareas</a>
            <a class="rounded-2xl bg-blue-50 px-5 py-4 text-sm font-semibold text-blue-700 hover:bg-blue-100" href="/src/views/dashboard.html">Volver al dashboard</a>
          </div>
        </article>

        <article class="rounded-3xl border border-blue-100 bg-white p-6 shadow-lg shadow-blue-50">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-bold text-slate-900">Usuarios</h2>
            <span class="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-blue-700">Mockup</span>
          </div>
          <div class="mt-5 space-y-4">
            <div class="rounded-2xl bg-blue-50 p-4">
              <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p class="font-bold text-slate-900">Ana Torres</p>
                  <p class="text-sm text-slate-500">ana@taskflow.com</p>
                </div>
                <div class="flex gap-2">
                  <span class="rounded-full bg-white px-3 py-1 text-xs font-bold text-blue-700">USER</span>
                  <a class="rounded-full border border-blue-200 px-3 py-1 text-xs font-semibold text-blue-700 hover:bg-white" href="/src/views/admin.html">Editar rol</a>
                </div>
              </div>
            </div>
            <div class="rounded-2xl bg-blue-50 p-4">
              <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p class="font-bold text-slate-900">Carlos Ruiz</p>
                  <p class="text-sm text-slate-500">carlos@taskflow.com</p>
                </div>
                <div class="flex gap-2">
                  <span class="rounded-full bg-white px-3 py-1 text-xs font-bold text-blue-700">ADMIN</span>
                  <a class="rounded-full border border-blue-200 px-3 py-1 text-xs font-semibold text-blue-700 hover:bg-white" href="/src/views/admin.html">Editar rol</a>
                </div>
              </div>
            </div>
          </div>
        </article>
      </section>
    </main>
```


login.js
```
<main class="grid min-h-screen lg:grid-cols-[1fr_0.95fr]">
      <section class="flex items-center justify-center px-6 py-10">
        <div class="w-full max-w-xl rounded-[2rem] border border-blue-100 bg-white p-8 shadow-xl shadow-blue-100/70">
          <div class="flex items-center justify-between">
            <a class="text-xl font-black tracking-tight text-blue-900" href="/src/views/home.html">TaskFlowSPA</a>
            <a class="rounded-full border border-blue-200 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50" href="/src/views/register.html">Registrarse</a>
          </div>

          <div class="mt-8">
            <p class="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">Inicio de sesion</p>
            <h1 class="mt-2 text-4xl font-black tracking-tight text-slate-900">Bienvenido de nuevo</h1>
            <p class="mt-4 text-slate-600">Ingresa a tu espacio de trabajo y continua organizando tus tareas.</p>
          </div>

          <form class="mt-8 grid gap-5">
            <div>
              <label class="mb-2 block text-sm font-medium text-slate-700" for="email">Correo</label>
              <input id="email" type="email" placeholder="usuario@taskflow.com" class="w-full rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none" />
            </div>
            <div>
              <label class="mb-2 block text-sm font-medium text-slate-700" for="password">Contrasena</label>
              <input id="password" type="password" placeholder="Ingresa tu contrasena" class="w-full rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none" />
            </div>
            <a class="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-500" href="/src/views/dashboard.html">
              Entrar al dashboard
            </a>
          </form>
        </div>
      </section>

      <section class="hidden bg-blue-600 p-10 text-white lg:flex lg:flex-col lg:justify-center">
        <div class="mx-auto max-w-lg">
          <p class="text-sm font-semibold uppercase tracking-[0.3em] text-blue-100">TaskFlowSPA</p>
          <h2 class="mt-4 text-5xl font-black tracking-tight">Una experiencia limpia para aprender una primera SPA.</h2>
          <ul class="mt-8 space-y-4 text-lg leading-8 text-blue-50">
            <li>Autenticacion simplificada con localStorage.</li>
            <li>Gestion de tareas con enfoque claro y visual.</li>
            <li>Roles y permisos entendibles desde el primer recorrido.</li>
          </ul>
        </div>
      </section>
    </main>
```


profile.js
```
<main class="mx-auto max-w-5xl px-6 py-10">
      <section class="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <aside class="rounded-[2rem] bg-blue-600 p-8 text-white shadow-xl shadow-blue-100">
          <p class="text-sm font-semibold uppercase tracking-[0.3em] text-blue-100">Cuenta</p>
          <h1 class="mt-3 text-4xl font-black tracking-tight">Mi perfil</h1>
          <p class="mt-4 text-blue-50">El usuario puede actualizar sus datos personales y gestionar su propia cuenta dentro del sistema.</p>
        </aside>

        <section class="rounded-[2rem] border border-blue-100 bg-white p-8 shadow-xl shadow-blue-50">
          <form class="grid gap-5">
            <div>
              <label class="mb-2 block text-sm font-medium text-slate-700" for="name">Nombre</label>
              <input id="name" type="text" value="Ana Torres" class="w-full rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-slate-900 focus:border-blue-400 focus:outline-none" />
            </div>
            <div>
              <label class="mb-2 block text-sm font-medium text-slate-700" for="profile-email">Correo</label>
              <input id="profile-email" type="email" value="ana@taskflow.com" class="w-full rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-slate-900 focus:border-blue-400 focus:outline-none" />
            </div>
            <div>
              <label class="mb-2 block text-sm font-medium text-slate-700" for="password-new">Nueva contrasena</label>
              <input id="password-new" type="password" placeholder="Actualiza tu contrasena" class="w-full rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none" />
            </div>
            <div class="flex flex-col gap-3 pt-2 sm:flex-row">
              <a class="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-500" href="/src/views/profile.html">Guardar cambios</a>
              <a class="inline-flex items-center justify-center rounded-2xl border border-blue-200 bg-white px-5 py-3 text-sm font-bold text-blue-700 hover:bg-blue-50" href="/src/views/login.html">Eliminar mi cuenta</a>
            </div>
          </form>
        </section>
      </section>
    </main>
```



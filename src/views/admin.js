import { getUsers, deleteUser } from '../services/users.service.js';

export const renderAdmin = () => {
    // El backtick AHORA está en la misma línea del return
    return `
    <header class="border-b border-blue-100 bg-white/90 backdrop-blur">
      <div class="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <a class="text-xl font-black text-blue-900" href="/" data-link>TaskFlowSPA</a>
        <nav class="hidden gap-3 md:flex">
          <a class="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-blue-50 hover:text-blue-700" href="/dashboard" data-link>Dashboard</a>
          <a class="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-blue-50 hover:text-blue-700" href="/tasks" data-link>Tareas</a>
          <a class="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-blue-50 hover:text-blue-700" href="/profile" data-link>Perfil</a>
          <a class="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white" href="/admin" data-link>Admin</a>
        </nav>
      </div>
    </header>

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
            <a class="rounded-2xl bg-blue-50 px-5 py-4 text-sm font-semibold text-blue-700 hover:bg-blue-100" href="/admin" data-link>Gestionar usuarios</a>
            <a class="rounded-2xl bg-blue-50 px-5 py-4 text-sm font-semibold text-blue-700 hover:bg-blue-100" href="/tasks" data-link>Ver todas las tareas</a>
            <a class="rounded-2xl bg-blue-50 px-5 py-4 text-sm font-semibold text-blue-700 hover:bg-blue-100" href="/dashboard" data-link>Volver al dashboard</a>
          </div>
        </article>

        <article class="rounded-3xl border border-blue-100 bg-white p-6 shadow-lg shadow-blue-50">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-bold text-slate-900">Usuarios Registrados</h2>
          </div>
          
          <div id="admin-users-container" class="mt-5 space-y-4">
            <p class="text-slate-500 text-center">Cargando usuarios...</p>
          </div>
        </article>
      </section>
    </main>`;
}

export async function initAdmin() {
  const usersContainer = document.getElementById('admin-users-container');
  if (!usersContainer) return;

  try {
    const users = await getUsers();
    usersContainer.innerHTML = ''; // Limpiamos el mensaje de carga

    if (users.length === 0) {
      usersContainer.innerHTML = '<p class="text-slate-500 text-center py-4">No hay usuarios registrados.</p>';
      return;
    }

    // Recorremos los usuarios de la base de datos y los pintamos
    users.forEach(user => {
      const userHTML = `
        <div class="rounded-2xl bg-blue-50 p-4">
          <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p class="font-bold text-slate-900">${user.name} ${user.lastname || ''}</p>
              <p class="text-sm text-slate-500">${user.email}</p>
            </div>
            <div class="flex gap-2 items-center">
              <span class="rounded-full bg-white px-3 py-1 text-xs font-bold text-blue-700">${user.role || 'USER'}</span>
              <button class="delete-user-btn rounded-full border border-red-200 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-white" data-id="${user.id}">Eliminar</button>
            </div>
          </div>
        </div>
      `;
      usersContainer.innerHTML += userHTML;
    });

    // Le agregamos el evento a los botones de eliminar (como hicimos en las tareas)
    document.querySelectorAll('.delete-user-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const userId = e.target.getAttribute('data-id');
        const confirmDelete = confirm('¿Seguro que deseas eliminar a este usuario?');
        
        if (confirmDelete) {
          try {
            await deleteUser(userId);
            alert('Usuario eliminado correctamente.');
            await initAdmin(); // Recargar la lista visualmente
          } catch (error) {
            console.error('Error al eliminar usuario:', error);
            alert('No se pudo eliminar al usuario.');
          }
        }
      });
    });

  } catch (error) {
    console.error('Error al cargar la lista de usuarios:', error);
    usersContainer.innerHTML = '<p class="text-red-500 text-center py-4">Error al cargar los usuarios.</p>';
  }
}
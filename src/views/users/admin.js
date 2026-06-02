import { getUsers, deleteUser, updateUser } from '../../services/users.service.js';
import { renderHeader, initHeader } from '../../components/header.js';
import Swal from 'sweetalert2';

export const renderAdmin = () => {
    return `
    ${renderHeader()}

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

import { initCustomDropdown } from '../../utils/dropdown.js';

export async function initAdmin() {
  initHeader();

  const usersContainer = document.getElementById('admin-users-container');
  if (!usersContainer) return;

  try {
    const users = await getUsers();
    usersContainer.innerHTML = '';

    if (users.length === 0) {
      usersContainer.innerHTML = '<p class="text-slate-500 text-center py-4">No hay usuarios registrados.</p>';
      return;
    }

    users.forEach(user => {
      const userRole = user.role || 'USER';
      const userHTML = `
        <div class="rounded-2xl bg-blue-50 p-4">
          <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p class="font-bold text-slate-900">${user.name} ${user.lastname || ''}</p>
              <p class="text-sm text-slate-500">${user.email}</p>
            </div>
            <div class="flex gap-2 items-center">
              <div class="relative custom-dropdown" data-id="${user.id}">
                <button class="dropdown-btn rounded-full bg-white px-3 py-1 text-xs font-bold text-blue-700 border border-blue-200 focus:outline-none hover:bg-blue-50 flex items-center gap-1 cursor-pointer">
                  <span class="dropdown-value">${userRole}</span>
                  <svg class="w-3 h-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>
                <div class="dropdown-menu hidden absolute right-0 md:right-auto md:left-0 mt-2 w-28 rounded-2xl bg-white shadow-xl shadow-blue-100 border border-blue-50 z-10 overflow-hidden py-1">
                  <button class="dropdown-option w-full text-left px-4 py-2 text-xs font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors" data-value="USER">USER</button>
                  <button class="dropdown-option w-full text-left px-4 py-2 text-xs font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors" data-value="ADMIN">ADMIN</button>
                </div>
              </div>
              <button class="delete-user-btn rounded-full border border-red-200 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-white cursor-pointer" data-id="${user.id}">Eliminar</button>
            </div>
          </div>
        </div>
      `;
      usersContainer.innerHTML += userHTML;
    });

    initCustomDropdown('.custom-dropdown', async (newRole, dropdown) => {
      const valueSpan = dropdown.querySelector('.dropdown-value');
      const userId = dropdown.getAttribute('data-id');

      if (newRole === valueSpan.textContent) return;

      const originalRole = valueSpan.textContent;
      valueSpan.textContent = '...';

      const userToUpdate = users.find(u => u.id === userId);
      if (userToUpdate) {
        try {
          userToUpdate.role = newRole;
          await updateUser(userId, userToUpdate);
          valueSpan.textContent = newRole;
        } catch (error) {
          console.error('Error al actualizar rol:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo actualizar el rol del usuario.'
          });
          valueSpan.textContent = originalRole;
        }
      }
    });

    document.querySelectorAll('.delete-user-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const userId = e.target.getAttribute('data-id');
        const result = await Swal.fire({
          title: '¿Eliminar usuario?',
          text: '¿Seguro que deseas eliminar a este usuario?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#ef4444',
          cancelButtonColor: '#94a3b8',
          confirmButtonText: 'Sí, eliminar',
          cancelButtonText: 'Cancelar'
        });
        
        if (result.isConfirmed) {
          try {
            await deleteUser(userId);
            Swal.fire({
              icon: 'success',
              title: 'Eliminado',
              text: 'Usuario eliminado correctamente.',
              timer: 1500,
              showConfirmButton: false
            });
            await initAdmin();
          } catch (error) {
            console.error('Error al eliminar usuario:', error);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo eliminar al usuario.'
            });
          }
        }
      });
    });

  } catch (error) {
    console.error('Error al cargar la lista de usuarios:', error);
    usersContainer.innerHTML = '<p class="text-red-500 text-center py-4">Error al cargar los usuarios.</p>';
  }
}

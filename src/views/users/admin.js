import { getUsers, deleteUser, updateUser } from '../../services/users.service.js';
import { renderHeader, initHeader } from '../../components/header.js';
import Swal from 'sweetalert2';

// ==========================================
// VISTA DE ADMINISTRADOR (admin.js)
// Interfaz exclusiva para usuarios con rol ADMIN.
// Permite visualizar y gestionar (eliminar, 
// cambiar roles) a otros usuarios del sistema.
// ==========================================

export const renderAdmin = () => {
    // Renderiza el HTML principal concatenando la cabecera (Header)
    return `
    ${renderHeader()}

    <main class="mx-auto max-w-7xl px-6 py-10">
      <section class="rounded-[2rem] bg-blue-600 dark:bg-slate-800 border border-transparent dark:border-slate-700 px-8 py-10 text-white shadow-xl shadow-blue-100 dark:shadow-black/50 transition-colors duration-300">
        <p class="text-sm font-semibold uppercase tracking-[0.3em] text-blue-100 dark:text-blue-300">Rol administrador</p>
        <h1 class="mt-3 text-4xl font-black tracking-tight dark:text-white">Panel administrativo</h1>
        <p class="mt-4 max-w-2xl text-blue-50 dark:text-slate-300">Vista reservada para gestionar usuarios, roles, permisos y monitoreo general del sistema.</p>
      </section>

      <section class="mt-8 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <article class="rounded-3xl border border-blue-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-lg shadow-blue-200 dark:shadow-black/40 transition-colors duration-300">
          <h2 class="text-xl font-bold text-slate-900 dark:text-slate-100">Acciones rapidas</h2>
          <div class="mt-5 grid gap-4">
            <a class="rounded-2xl bg-blue-50 dark:bg-slate-700 px-5 py-4 text-sm font-semibold text-blue-700 dark:text-blue-400 shadow-blue-200 dark:shadow-black/30 shadow-md hover:bg-blue-100 dark:hover:bg-slate-600 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer block" href="/admin" data-link>Gestionar usuarios</a>
            <a class="rounded-2xl bg-blue-50 dark:bg-slate-700 px-5 py-4 text-sm font-semibold text-blue-700 dark:text-blue-400 shadow-blue-200 dark:shadow-black/30 shadow-md hover:bg-blue-100 dark:hover:bg-slate-600 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer block" href="/tasks" data-link>Ver todas las tareas</a>
            <a class="rounded-2xl bg-blue-50 dark:bg-slate-700 px-5 py-4 text-sm font-semibold text-blue-700 dark:text-blue-400 shadow-blue-200 dark:shadow-black/30 shadow-md hover:bg-blue-100 dark:hover:bg-slate-600 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer block" href="/dashboard" data-link>Volver al dashboard</a>
          </div>
        </article>

        <article class="rounded-3xl border border-blue-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-lg shadow-blue-200 dark:shadow-black/40 transition-colors duration-300">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-bold text-slate-900 dark:text-slate-100">Usuarios Registrados</h2>
          </div>
          
          <div id="admin-users-container" class="mt-5 space-y-4">
            <p class="text-slate-500 dark:text-slate-400 text-center">Cargando usuarios...</p>
          </div>
        </article>
      </section>
    </main>`;
}

// Importa utilidad para el funcionamiento visual de los menús desplegables
import { initCustomDropdown } from '../../utils/dropdown.js';

// ==========================================
// INICIALIZAR PANEL DE ADMIN (initAdmin)
// Obtiene todos los usuarios, los inyecta en 
// el HTML y asocia los eventos de borrado y
// cambio de roles.
// ==========================================
export async function initAdmin() {
  // Inicializamos eventos de la cabecera
  initHeader();

  // Contenedor principal de usuarios
  const usersContainer = document.getElementById('admin-users-container');
  if (!usersContainer) return;

  try {
    const users = await getUsers();
    usersContainer.innerHTML = '';

    if (users.length === 0) {
      usersContainer.innerHTML = '<p class="text-slate-500 text-center py-4">No hay usuarios registrados.</p>';
      return;
    }

    // ==========================================
    // RENDERIZADO DE LA LISTA DE USUARIOS
    // ==========================================
    users.forEach(user => {
      const userRole = user.role || 'USER';
      const userHTML = `
        <div class="rounded-2xl bg-blue-50 dark:bg-slate-700/50 p-4 transition-colors duration-300 hover:bg-blue-200/70 dark:hover:bg-slate-700 border border-transparent dark:border-slate-600">
          <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p class="font-bold text-slate-900 dark:text-white">${user.name} ${user.lastname || ''}</p>
              <p class="text-sm text-slate-500 dark:text-slate-400">${user.email}</p>
            </div>
            <div class="flex items-center gap-2 relative">
              <div class="relative custom-dropdown" data-id="${user.id}">
                <button class="dropdown-btn rounded-full bg-white dark:bg-slate-700 px-3 py-1 text-xs font-bold text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-slate-500 focus:outline-none hover:bg-blue-200/80 dark:hover:bg-slate-600 flex items-center gap-1 cursor-pointer transition-colors duration-200">
                  <span class="dropdown-value">${userRole}</span>
                  <svg class="w-3 h-3 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>
                <div class="dropdown-menu hidden absolute right-0 md:right-auto md:left-0 mt-2 w-28 rounded-2xl bg-white dark:bg-slate-800 shadow-xl shadow-blue-100 dark:shadow-black/50 border border-blue-200 dark:border-slate-600 z-10 overflow-hidden py-1">
                  <button class="dropdown-option w-full text-left px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-blue-700 dark:hover:text-blue-400 transition-colors" data-value="USER">USER</button>
                  <button class="dropdown-option w-full text-left px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-blue-700 dark:hover:text-blue-400 transition-colors" data-value="ADMIN">ADMIN</button>
                </div>
              </div>
              <button class="delete-user-btn rounded-full border border-red-300 dark:border-red-500 px-3 py-1 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-200/80 dark:hover:bg-red-900/40 cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95" data-id="${user.id}">Eliminar</button>
            </div>
          </div>
        </div>
      `;
      usersContainer.innerHTML += userHTML;
    });

    // ==========================================
    // EVENTO: CAMBIAR ROL (Dropdown)
    // ==========================================
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

    // ==========================================
    // EVENTO: ELIMINAR USUARIO
    // ==========================================
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

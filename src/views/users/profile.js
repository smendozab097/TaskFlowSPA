import { updateUser, deleteUser } from '../../services/users.service.js';
import { getSession, deleteSession, createSession } from '../../services/auth.service.js';
import { renderHeader, initHeader } from '../../components/header.js';
import Swal from 'sweetalert2';

export const renderProfile = () => {
    return `
    ${renderHeader()}

    <main class="mx-auto max-w-5xl px-6 py-10">
      <section class="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <aside class="rounded-[2rem] bg-blue-600 dark:bg-slate-800 border border-transparent dark:border-slate-700 p-8 text-white shadow-xl shadow-blue-100 dark:shadow-black/50 transition-colors duration-300">
          <p class="text-sm font-semibold uppercase tracking-[0.3em] text-blue-100 dark:text-blue-300">Cuenta</p>
          <h1 class="mt-3 text-4xl font-black tracking-tight dark:text-white">Mi perfil</h1>
          <p class="mt-4 text-blue-50 dark:text-slate-300">El usuario puede actualizar sus datos personales y gestionar su propia cuenta dentro del sistema.</p>
        </aside>

        <section class="rounded-[2rem] border border-blue-100 dark:border-slate-700 bg-white dark:bg-slate-800 p-8 shadow-xl shadow-blue-50 dark:shadow-black/40 transition-colors duration-300">
          <form id="profile-form" class="grid gap-5">
            <div class="grid gap-5 md:grid-cols-2">
              <div>
                <label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200" for="name">Nombre</label>
                <input id="name" name="name" type="text" required class="w-full rounded-2xl border border-gray-400/80 dark:border-slate-600 bg-blue-50 dark:bg-slate-700 px-4 py-3 text-slate-900 dark:text-white focus:outline-none transition-all duration-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent" />
              </div>
              <div>
                <label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200" for="lastname">Apellido</label>
                <input id="lastname" name="lastname" type="text" required class="w-full rounded-2xl border border-gray-400/80 dark:border-slate-600 bg-blue-50 dark:bg-slate-700 px-4 py-3 text-slate-900 dark:text-white focus:outline-none transition-all duration-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent" />
              </div>
            </div>

            <div>
              <label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200" for="profile-email">Correo</label>
              <input id="profile-email" name="email" type="email" required class="w-full rounded-2xl border border-gray-400/80 dark:border-slate-600 bg-blue-50 dark:bg-slate-700 px-4 py-3 text-slate-900 dark:text-white focus:outline-none transition-all duration-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent" />
            </div>

            <div>
              <label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200" for="password-new">Nueva contraseña</label>
              <input id="password-new" name="password" type="password" placeholder="Escribe solo si deseas cambiarla" class="w-full rounded-2xl border border-gray-400/80 dark:border-slate-600 bg-blue-50 dark:bg-slate-700 px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none transition-all duration-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent" />
            </div>

            <div class="flex flex-col gap-3 pt-2 sm:flex-row">
              <button type="submit" class="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-500 cursor-pointer transition-all duration-300 hover:scale-[1.03] active:scale-95 hover:shadow-lg dark:shadow-black/50">
                Guardar cambios
              </button>
              <button type="button" id="delete-account-btn" class="inline-flex items-center justify-center rounded-2xl border border-red-400 dark:border-red-500 bg-white dark:bg-slate-700 px-5 py-3 text-sm font-bold text-red-600 dark:text-red-400 hover:bg-red-200/80 dark:hover:bg-red-900/40 cursor-pointer transition-all duration-300 hover:scale-[1.03] active:scale-95">
                Eliminar mi cuenta
              </button>
            </div>
          </form>
        </section>
      </section>
    </main>`
}

export function initProfile() {
  initHeader();

  const profileForm = document.getElementById('profile-form');
  const deleteBtn = document.getElementById('delete-account-btn');
  
  const user = getSession();
  if (!user) return;

  if (profileForm) {
    document.getElementById('name').value = user.name || '';
    document.getElementById('lastname').value = user.lastname || '';
    document.getElementById('profile-email').value = user.email || '';

    profileForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const data = new FormData(profileForm);
      const newPassword = data.get('password');
      
      const updatedUser = {
        ...user, 
        name: data.get('name').trim(),
        lastname: data.get('lastname').trim(),
        email: data.get('email').trim().toLowerCase(),
        password: newPassword ? newPassword : user.password
      };

      try {
        await updateUser(user.id, updatedUser);
        createSession(updatedUser);
        
        document.getElementById('password-new').value = '';
        Swal.fire({
          icon: 'success',
          title: 'Actualizado',
          text: 'Perfil actualizado correctamente.',
          timer: 1500,
          showConfirmButton: false
        });
      } catch (error) {
        console.error('Error al actualizar:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo actualizar el perfil. Verifica tu conexion al servidor.'
        });
      }
    });

    if (deleteBtn) {
      deleteBtn.addEventListener('click', async () => {
        const result = await Swal.fire({
          title: '¿Eliminar cuenta?',
          text: '¿Seguro que deseas eliminar tu cuenta? Esta accion no se puede deshacer.',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#ef4444',
          cancelButtonColor: '#94a3b8',
          confirmButtonText: 'Sí, eliminar',
          cancelButtonText: 'Cancelar'
        });
        
        if (!result.isConfirmed) return;

        try {
          await deleteUser(user.id);
          deleteSession();
          
          Swal.fire({
            icon: 'success',
            title: 'Eliminada',
            text: 'Tu cuenta ha sido eliminada.',
            timer: 1500,
            showConfirmButton: false
          }).then(() => {
            history.pushState(null, null, '/login');
            window.dispatchEvent(new Event('popstate'));
          });
          
        } catch (error) {
          console.error('Error al eliminar:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al eliminar la cuenta.'
          });
        }
      });
    }
  }
}

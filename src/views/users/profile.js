import { updateUser, deleteUser } from '../../services/users.service.js';
import { getSession, deleteSession, createSession } from '../../services/auth.service.js';
import { renderHeader, initHeader } from '../../components/header.js';
import Swal from 'sweetalert2';

export const renderProfile = () => {
    return `
    ${renderHeader()}

    <main class="mx-auto max-w-5xl px-6 py-10">
      <section class="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <aside class="rounded-[2rem] bg-blue-600 p-8 text-white shadow-xl shadow-blue-100">
          <p class="text-sm font-semibold uppercase tracking-[0.3em] text-blue-100">Cuenta</p>
          <h1 class="mt-3 text-4xl font-black tracking-tight">Mi perfil</h1>
          <p class="mt-4 text-blue-50">El usuario puede actualizar sus datos personales y gestionar su propia cuenta dentro del sistema.</p>
        </aside>

        <section class="rounded-[2rem] border border-blue-100 bg-white p-8 shadow-xl shadow-blue-50">
          <form id="profile-form" class="grid gap-5">
            <div class="grid gap-5 md:grid-cols-2">
              <div>
                <label class="mb-2 block text-sm font-medium text-slate-700" for="name">Nombre</label>
                <input id="name" name="name" type="text" required class="w-full rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-slate-900 focus:border-blue-400 focus:outline-none" />
              </div>
              <div>
                <label class="mb-2 block text-sm font-medium text-slate-700" for="lastname">Apellido</label>
                <input id="lastname" name="lastname" type="text" required class="w-full rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-slate-900 focus:border-blue-400 focus:outline-none" />
              </div>
            </div>

            <div>
              <label class="mb-2 block text-sm font-medium text-slate-700" for="profile-email">Correo</label>
              <input id="profile-email" name="email" type="email" required class="w-full rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-slate-900 focus:border-blue-400 focus:outline-none" />
            </div>

            <div>
              <label class="mb-2 block text-sm font-medium text-slate-700" for="password-new">Nueva contraseña</label>
              <input id="password-new" name="password" type="password" placeholder="Escribe solo si deseas cambiarla" class="w-full rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none" />
            </div>

            <div class="flex flex-col gap-3 pt-2 sm:flex-row">
              <button type="submit" class="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-500 cursor-pointer">
                Guardar cambios
              </button>
              <button type="button" id="delete-account-btn" class="inline-flex items-center justify-center rounded-2xl border border-blue-200 bg-white px-5 py-3 text-sm font-bold text-red-600 hover:bg-red-50 cursor-pointer">
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

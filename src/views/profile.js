import { updateUser, deleteUser } from '../services/users.service.js';

export const renderProfile = () => {
    return `
    <header class="border-b border-blue-100 bg-white/90 backdrop-blur">
      <div class="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <a class="text-xl font-black text-blue-900" href="/" data-link>TaskFlowSPA</a>
        <nav class="hidden gap-3 md:flex">
          <a class="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-blue-50 hover:text-blue-700" href="/dashboard" data-link>Dashboard</a>
          <a class="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-blue-50 hover:text-blue-700" href="/tasks" data-link>Tareas</a>
          <a class="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white" href="/profile" data-link>Perfil</a>
        </nav>
      </div>
    </header>

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
              <label class="mb-2 block text-sm font-medium text-slate-700" for="password-new">Nueva contrasena</label>
              <input id="password-new" name="password" type="password" placeholder="Escribe solo si deseas cambiarla" class="w-full rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none" />
            </div>

            <div class="flex flex-col gap-3 pt-2 sm:flex-row">
              <button type="submit" class="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-500">
                Guardar cambios
              </button>
              <button type="button" id="delete-account-btn" class="inline-flex items-center justify-center rounded-2xl border border-blue-200 bg-white px-5 py-3 text-sm font-bold text-red-600 hover:bg-red-50">
                Eliminar mi cuenta
              </button>
            </div>
          </form>
        </section>
      </section>
    </main>`
}

export function initProfile() {
  const profileForm = document.getElementById('profile-form');
  const deleteBtn = document.getElementById('delete-account-btn');
  
  const sessionData = localStorage.getItem('currentUser');
  if (!sessionData) return;
  
  const user = JSON.parse(sessionData);

  if (profileForm) {
    document.getElementById('name').value = user.name || '';
    document.getElementById('lastname').value = user.lastname || '';
    document.getElementById('profile-email').value = user.email || '';

    // EVENTO DE ACTUALIZAR
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
        // 1. Guardamos en la base de datos real
        await updateUser(user.id, updatedUser);

        // 2. Actualizamos la sesion del navegador
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        
        document.getElementById('password-new').value = '';
        alert('Perfil actualizado correctamente.');
      } catch (error) {
        console.error('Error al actualizar:', error);
        alert('No se pudo actualizar el perfil. Verifica tu conexion al servidor.');
      }
    });

    // EVENTO DE ELIMINAR
    if (deleteBtn) {
      deleteBtn.addEventListener('click', async () => {
        const isConfirmed = confirm('¿Seguro que deseas eliminar tu cuenta? Esta accion no se puede deshacer.');
        
        if (!isConfirmed) return;

        try {
          // 1. Borramos de la base de datos real
          await deleteUser(user.id);

          // 2. Borramos la sesion del navegador
          localStorage.removeItem('currentUser');
          
          alert('Tu cuenta ha sido eliminada.');
          
          // history.pushState(null, null, '/login');
        } catch (error) {
          console.error('Error al eliminar:', error);
          alert('Hubo un problema al eliminar la cuenta.');
        }
      });
    }
  }
}
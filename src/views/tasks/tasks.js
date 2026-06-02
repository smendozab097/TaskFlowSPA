import { deleteTask, getTasks } from "../../services/tasks.service.js";
import { getSession } from "../../services/auth.service.js";
import { getUsers } from "../../services/users.service.js";
import { renderHeader, initHeader } from "../../components/header.js";
import Swal from 'sweetalert2';

export const renderTasks = () => {
  return `
    ${renderHeader()}

    <main class="mx-auto max-w-6xl px-6 py-10">
      <section class="flex flex-col gap-4 rounded-[2rem] bg-blue-600 px-8 py-10 text-white md:flex-row md:items-end md:justify-between shadow-xl shadow-blue-100">
        <div>
          <p class="text-sm font-semibold uppercase tracking-[0.3em] text-blue-100">CRUD de tareas</p>
          <h1 class="mt-3 text-4xl font-black tracking-tight">Mis tareas</h1>
          <p class="mt-4 max-w-2xl text-blue-50">Vista principal para listar, editar y eliminar las tareas del usuario autenticado.</p>
        </div>
        <a class="inline-flex items-center justify-center rounded-2xl bg-white px-5 py-3 text-sm font-bold text-blue-700 hover:bg-blue-50" href="/task-form" data-link>
          Crear tarea
        </a>
      </section>

      <section id="tasks-container" class="mt-8 grid gap-4">
        <p class="text-slate-500 text-center py-10">Cargando tareas...</p>
      </section>
    </main>
    `;
}

export async function initTasks() {
  initHeader();

  const tasksContainer = document.getElementById('tasks-container');
  if (!tasksContainer) return;

  const user = getSession();
  if (!user) return;

  try {
    const isAdmin = user.role && user.role.includes('ADMIN');
    console.log(isAdmin ? 'Usuario con rol ADMIN' : 'Usuario con rol USER');

    // Obtenemos las tareas correspondientes
    const tasks = isAdmin ? await getTasks() : await getTasks(user.id);

    // Si es ADMIN, traemos la lista de usuarios para poder cruzarlos
    let usersList = [];
    if (isAdmin) {
      try {
        usersList = await getUsers();
      } catch (err) {
        console.error('Error al cargar la lista de usuarios para asignar dueños:', err);
      }
    }

    tasksContainer.innerHTML = '';

    if (tasks.length === 0) {
      tasksContainer.innerHTML = '<p class="text-slate-500 text-center py-10">No tienes tareas registradas.</p>';
      return;
    }

    tasks.forEach(task => {
      // Cruzamos los datos para obtener el nombre del propietario
      let ownerInfo = '';
      if (isAdmin) {
        const owner = usersList.find(u => u.id === task.userid);
        const ownerName = owner ? `${owner.name} ${owner.lastname || ''}` : 'Desconocido';
        const ownerEmail = owner ? owner.email : 'N/A';
        ownerInfo = `<p class="text-xs text-slate-500 mt-2 bg-blue-50/50 inline-block px-3 py-1 rounded-full border border-blue-100">Asignada a: <strong>${ownerName}</strong> (${ownerEmail})</p>`;
      }

      const taskHTML = `
        <article class="rounded-3xl border border-blue-100 bg-white p-6 shadow-lg shadow-blue-50">
          <div class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p class="text-xs font-bold uppercase tracking-[0.25em] text-blue-600">${task.status}</p>
              <h2 class="mt-2 text-2xl font-bold text-slate-900">${task.title}</h2>
              <p class="mt-3 max-w-2xl text-slate-600">${task.description}</p>
              ${ownerInfo}
            </div>
            <div class="flex gap-3">
              <a class="rounded-full border border-blue-200 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50" href="/task-form?id=${task.id}" data-link>Editar</a>
              <button class="delete-btn rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 cursor-pointer" data-id="${task.id}">Eliminar</button>
            </div>
          </div>
        </article>
      `;
      tasksContainer.innerHTML += taskHTML;
    });

    const deleteButtons = document.querySelectorAll('.delete-btn');
    deleteButtons.forEach(button => {
      button.addEventListener('click', async (e) => {
        const taskId = e.target.getAttribute('data-id');
        const result = await Swal.fire({
          title: '¿Eliminar tarea?',
          text: '¿Estas seguro de que deseas eliminar esta tarea?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#ef4444',
          cancelButtonColor: '#94a3b8',
          confirmButtonText: 'Sí, eliminar',
          cancelButtonText: 'Cancelar'
        });

        if (!result.isConfirmed) return;

        try {
          console.log('Solicitud para eliminar tarea con ID:', taskId);
          await deleteTask(taskId);

          console.log('Tarea eliminada exitosamente.');
          Swal.fire({
            icon: 'success',
            title: 'Eliminada',
            text: 'Tarea eliminada exitosamente.',
            timer: 1500,
            showConfirmButton: false
          });

          await initTasks();

        } catch (error) {
          console.error('Error al eliminar la tarea:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ocurrio un error al eliminar la tarea. Por favor, intenta nuevamente.'
          });
        }
      });
    });

  } catch (error) {
    console.error('Error al cargar las tareas:', error);
    tasksContainer.innerHTML = '<p class="text-red-500 text-center py-10">Ocurrió un error al cargar las tareas.</p>';
  }
}

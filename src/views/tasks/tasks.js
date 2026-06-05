import { deleteTask, getTasks } from "../../services/tasks.service.js";
import { getSession } from "../../services/auth.service.js";
import { getUsers } from "../../services/users.service.js";
import { renderHeader, initHeader } from "../../components/header.js";
import Swal from 'sweetalert2';

// ==========================================
// VISTA LISTADO DE TAREAS (tasks.js)
// Genera la vista principal donde el usuario
// puede ver, editar y eliminar sus tareas.
// ==========================================

export const renderTasks = () => {
  // Renderiza el HTML principal concatenando la cabecera (Header) y el contenedor de tareas
  return `
    ${renderHeader()}

    <main class="mx-auto max-w-6xl px-6 py-10">
      <section class="flex flex-col gap-4 rounded-[2rem] bg-blue-600 dark:bg-slate-800 border dark:border-slate-700 px-8 py-10 text-white md:flex-row md:items-end md:justify-between shadow-xl shadow-blue-100 dark:shadow-black/50 transition-colors duration-300">
        <div>
          <p class="text-sm font-semibold uppercase tracking-[0.3em] text-blue-100 dark:text-blue-300">CRUD de tareas</p>
          <h1 class="mt-3 text-4xl font-black tracking-tight dark:text-white">Mis tareas</h1>
          <p class="mt-4 max-w-2xl text-blue-50 dark:text-slate-300">Vista principal para listar, editar y eliminar las tareas del usuario autenticado.</p>
        </div>
        <a class="inline-flex items-center justify-center rounded-2xl bg-white dark:bg-slate-700 px-5 py-3 text-sm font-bold text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-600 transition-all duration-300 hover:scale-[1.03] active:scale-95 hover:shadow-lg cursor-pointer border border-transparent dark:border-slate-600" href="/task-form" data-link onclick="sessionStorage.removeItem('editTaskId')">
          Crear tarea
        </a>
      </section>

      <section id="tasks-container" class="mt-8 grid gap-4">
        <p class="text-slate-500 dark:text-slate-400 text-center py-10">Cargando tareas...</p>
      </section>
    </main>
    `;
}

// ==========================================
// INICIALIZAR LISTADO (initTasks)
// Obtiene las tareas desde el backend (JSON Server)
// y las pinta en el contenedor correspondiente.
// Además, asigna los eventos para eliminar tareas.
// ==========================================
export async function initTasks() {
  // Inicializamos eventos de la cabecera
  initHeader();

  // Obtenemos el contenedor donde inyectaremos cada tarea
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

    // Generamos el HTML para cada tarea iterando el arreglo
    tasks.forEach(task => {
      // Si somos ADMIN, Cruzamos los datos para obtener el nombre del propietario
      let ownerInfo = '';
      if (isAdmin) {
        const owner = usersList.find(u => u.id === task.userid);
        const ownerName = owner ? `${owner.name} ${owner.lastname || ''}` : 'Desconocido';
        const ownerEmail = owner ? owner.email : 'N/A';
        ownerInfo = `<p class="text-xs text-slate-500 dark:text-slate-400 mt-2 bg-blue-50/50 dark:bg-slate-700/50 inline-block px-3 py-1 rounded-full border border-blue-100 dark:border-slate-600">Asignada a: <strong class="dark:text-slate-300">${ownerName}</strong> (${ownerEmail})</p>`;
      }

      const taskHTML = `
        <article class="rounded-3xl border border-blue-100 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-lg shadow-blue-50 dark:shadow-black/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-default">
          <div class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p class="text-xs font-bold uppercase tracking-[0.25em] text-blue-600 dark:text-blue-400">${task.status}</p>
              <h2 class="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">${task.title}</h2>
              <p class="mt-3 max-w-2xl text-slate-600 dark:text-slate-300">${task.description}</p>
              ${ownerInfo}
            </div>
            <div class="flex gap-3">
              <a class="rounded-full border border-blue-400 dark:border-blue-500 px-4 py-2 text-sm font-semibold text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-700 transition-all duration-200 hover:scale-105 active:scale-95" href="/task-form" data-link onclick="sessionStorage.setItem('editTaskId', '${task.id}')">Editar</a>
              <button class="delete-btn rounded-full border border-red-400 dark:border-red-500 px-4 py-2 text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95" data-id="${task.id}">Eliminar</button>
            </div>
          </div>
        </article>
      `;
      tasksContainer.innerHTML += taskHTML;
    });

    // ==========================================
    // MANEJO DE ELIMINACIÓN DE TAREAS
    // ==========================================
    const deleteButtons = document.querySelectorAll('.delete-btn');
    deleteButtons.forEach(button => {
      button.addEventListener('click', async (e) => {
        const taskId = e.target.getAttribute('data-id');
        
        // Confirmación visual con SweetAlert antes de borrar
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

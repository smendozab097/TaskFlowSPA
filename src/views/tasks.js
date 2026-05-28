import { deleteTask, getTasks } from "../services/tasks.service";

export const renderTasks = () => {
  return `
    <header class="border-b border-blue-100 bg-white/90 backdrop-blur">
      <div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a class="text-xl font-black text-blue-900" href="/" data-link>TaskFlowSPA</a>
        <nav class="hidden gap-3 md:flex">
          <a class="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-blue-50 hover:text-blue-700" href="/dashboard" data-link>Dashboard</a>
          <a class="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white" href="/tasks" data-link>Tareas</a>
          <a class="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-blue-50 hover:text-blue-700" href="/profile" data-link>Perfil</a>
          <a class="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-blue-50 hover:text-blue-700" href="/admin" data-link>Admin</a>
        </nav>
      </div>
    </header>

    <main class="mx-auto max-w-6xl px-6 py-10">
      <section class="flex flex-col gap-4 rounded-[2rem] bg-blue-600 px-8 py-10 text-white md:flex-row md:items-end md:justify-between">
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
  const tasksContainer = document.getElementById('tasks-container');

  if (!tasksContainer) return;

  // NUEVO 1: Obtenemos la sesion del usuario para saber quien es y que rol tiene
  const sessionData = localStorage.getItem('currentUser');
  if (!sessionData) return;
  const user = JSON.parse(sessionData);

  try {
    // NUEVO 2: Verificamos si el usuario es administrador revisando su array de roles
    const isAdmin = user.role && user.role.includes('ADMIN');
    console.log(isAdmin ? 'Usuario con rol ADMIN' : 'Usuario con rol USER');

    // NUEVO 3: Si es ADMIN pide todas las tareas (sin id), si es USER pide solo las suyas (con id)
    const tasks = isAdmin ? await getTasks() : await getTasks(user.id);

    // Limpiamos el contenedor antes de renderizar las tareas
    tasksContainer.innerHTML = '';

    if (tasks.length === 0) {
      tasksContainer.innerHTML = '<p class="text-slate-500 text-center py-10">No tienes tareas registradas.</p>';
      return;
    }

    // Iteramos sobre las tareas y creamos el HTML para cada una
    tasks.forEach(task => {
      const taskHTML = `
        <article class="rounded-3xl border border-blue-100 bg-white p-6 shadow-lg shadow-blue-50">
          <div class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p class="text-xs font-bold uppercase tracking-[0.25em] text-blue-600">${task.status}</p>
              <h2 class="mt-2 text-2xl font-bold text-slate-900">${task.title}</h2>
              <p class="mt-3 max-w-2xl text-slate-600">${task.description}</p>
            </div>
            <div class="flex gap-3">
              <a class="rounded-full border border-blue-200 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50" href="/task-form?id=${task.id}" data-link>Editar</a>
              <button class="delete-btn rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50" data-id="${task.id}">Eliminar</button>
            </div>
          </div>
        </article>
      `;
      tasksContainer.innerHTML += taskHTML;
    });

    // Agregar eventos a los botones de eliminar generados dinámicamente
    const deleteButtons = document.querySelectorAll('.delete-btn');

    deleteButtons.forEach(button => {
      button.addEventListener('click', async (e) => {
        const taskId = e.target.getAttribute('data-id');

        // 1. Pedir confirmacion al usuario antes de eliminar
        const confirmDelete = confirm('¿Estas seguro de que deseas eliminar esta tarea?');

        // Si el usuario cancela, detenemos la ejecucion de la funcion aqui
        if (!confirmDelete) return;

        try {
          console.log('Solicitud para eliminar tarea con ID:', taskId);

          // 2. Esperamos a que la base de datos elimine la tarea
          await deleteTask(taskId);

          console.log('Tarea eliminada exitosamente.');
          alert('Tarea eliminada exitosamente.');

          // 3. Volvemos a ejecutar initTasks() para que recargue la lista de tareas
          // Es importante ponerle await si initTasks es una funcion asincrona
          await initTasks();

        } catch (error) {
          console.error('Error al eliminar la tarea:', error);
          alert('Ocurrio un error al eliminar la tarea. Por favor, intenta nuevamente.');
        }
      });
    });

  } catch (error) {
    console.error('Error al cargar las tareas:', error);
    tasksContainer.innerHTML = '<p class="text-red-500 text-center py-10">Ocurrió un error al cargar las tareas.</p>';
  }
}
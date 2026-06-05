import { createTask, updateTask, getTaskById } from '../../services/tasks.service.js';
import { getSession } from '../../services/auth.service.js';
import { renderHeader, initHeader } from '../../components/header.js';
import Swal from 'sweetalert2';

export const renderTaskForm = () => {
    return `
    ${renderHeader()}

    <main class="mx-auto max-w-5xl px-6 py-10">
      <section class="rounded-[2rem] border border-blue-100 dark:border-slate-700 bg-white dark:bg-slate-800 p-8 shadow-xl shadow-blue-50 dark:shadow-black/40 transition-colors duration-300">
        <p class="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600 dark:text-blue-400">Formulario</p>
        
        <h1 id="form-title" class="mt-3 text-4xl font-black tracking-tight text-slate-900 dark:text-slate-100">Cargando...</h1>
        <p id="form-description" class="mt-4 max-w-2xl text-slate-600 dark:text-slate-300">Por favor espera un momento.</p>

        <form id="task-form" class="mt-8 grid gap-5 hidden">
          <div>
            <label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200" for="title">Titulo</label>
            <input id="title" name="title" type="text" required placeholder="Ej. Preparar proyecto final" class="w-full rounded-2xl border border-blue-100 dark:border-slate-600 bg-blue-50 dark:bg-slate-700 px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none transition-all duration-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent" />
          </div>

          <div>
            <label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200" for="description">Descripcion</label>
            <textarea id="description" name="description" rows="5" required placeholder="Describe la tarea..." class="w-full rounded-2xl border border-blue-100 dark:border-slate-600 bg-blue-50 dark:bg-slate-700 px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none transition-all duration-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent"></textarea>
          </div>

          <div class="grid gap-5 md:grid-cols-2">
            <div>
              <label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200" for="status">Estado</label>
              <select id="status" name="status" class="w-full rounded-2xl border border-blue-100 dark:border-slate-600 bg-blue-50 dark:bg-slate-700 px-4 py-3 text-slate-900 dark:text-white focus:outline-none transition-all duration-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent cursor-pointer">
                <option value="Pendiente">Pendiente</option>
                <option value="En progreso">En progreso</option>
                <option value="Completada">Completada</option>
              </select>
            </div>
            <div>
              <label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200" for="date">Fecha limite</label>
              <input id="date" name="date" type="date" required class="w-full rounded-2xl border border-blue-100 dark:border-slate-600 bg-blue-50 dark:bg-slate-700 px-4 py-3 text-slate-900 dark:text-white focus:outline-none transition-all duration-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent cursor-pointer" />
            </div>
          </div>

          <div class="flex flex-col gap-3 pt-2 sm:flex-row">
            <button id="submit-btn" type="submit" class="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-500 cursor-pointer transition-all duration-300 hover:scale-[1.03] active:scale-95 hover:shadow-lg dark:shadow-black/50">
              Guardar tarea
            </button>
            <a class="inline-flex items-center justify-center rounded-2xl border border-blue-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-5 py-3 text-sm font-bold text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-600 transition-all duration-300 hover:scale-[1.03] active:scale-95" href="/tasks" data-link>
              Cancelar
            </a>
          </div>
        </form>
      </section>
    </main>`;
}

export async function initTaskForm() {
  initHeader();

  const taskForm = document.getElementById('task-form');
  const formTitle = document.getElementById('form-title');
  const formDescription = document.getElementById('form-description');
  const submitBtn = document.getElementById('submit-btn');

  if (!taskForm) return;

  const taskId = sessionStorage.getItem('editTaskId');

  if (taskId) {
    // MODO EDICION
    formTitle.textContent = 'Editar tarea';
    formDescription.textContent = 'Modifica los detalles de tu tarea existente.';
    submitBtn.textContent = 'Actualizar tarea';

    try {
      const taskToEdit = await getTaskById(taskId);
      const user = getSession();
      const isAdmin = user && user.role && user.role.includes('ADMIN');

      if (taskToEdit.userid !== user.id && !isAdmin) {
        import('../not-found.js').then(({ renderNotFound }) => {
          document.getElementById('app').innerHTML = renderNotFound();
        });
        return;
      }
      
      document.getElementById('title').value = taskToEdit.title;
      document.getElementById('description').value = taskToEdit.description;
      document.getElementById('status').value = taskToEdit.status;
      document.getElementById('date').value = taskToEdit.date;
      
      taskForm.classList.remove('hidden');
    } catch (error) {
      console.error('Error al cargar la tarea:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un error al cargar los datos de la tarea. Es posible que no exista.'
      });
    }

  } else {
    // MODO CREACION
    formTitle.textContent = 'Crear nueva tarea';
    formDescription.textContent = 'Registra los detalles para tu nueva tarea.';
    submitBtn.textContent = 'Guardar tarea';
    
    taskForm.classList.remove('hidden');
  }

  taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const user = getSession();
    if (!user) return;

    const data = new FormData(taskForm);
    
    const taskData = {
      title: data.get('title').trim(),
      description: data.get('description').trim(),
      status: data.get('status'),
      date: data.get('date'),
      userid: user.id
    };

    try {
      if (taskId) {
        await updateTask(taskId, taskData);
        Swal.fire({
          icon: 'success',
          title: 'Actualizada',
          text: 'Tarea actualizada exitosamente.',
          timer: 1500,
          showConfirmButton: false
        });
      } else {
        taskData.id = crypto.randomUUID();
        await createTask(taskData);
        Swal.fire({
          icon: 'success',
          title: 'Creada',
          text: 'Tarea creada exitosamente.',
          timer: 1500,
          showConfirmButton: false
        });
      }

      taskForm.reset();
      sessionStorage.removeItem('editTaskId');
      history.pushState(null, null, '/tasks');
      window.dispatchEvent(new Event('popstate'));
      
    } catch (error) {
      console.error('Error al guardar la tarea:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrio un error al intentar guardar la tarea.'
      });
    }
  });
}

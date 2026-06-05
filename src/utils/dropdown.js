// ----------------------------------------
// UTILIDAD DE MENU DESPLEGABLE (dropdown.js)
// Inicializa el comportamiento interactivo de dropdowns personalizados.
// ----------------------------------------
export function initCustomDropdown(containerSelector, onSelectCallback) {
  // Selecciona todos los contenedores de dropdown correspondientes en el DOM
  document.querySelectorAll(containerSelector).forEach(dropdown => {
    const btn = dropdown.querySelector('.dropdown-btn');
    const menu = dropdown.querySelector('.dropdown-menu');
    
    // Valida que el contenedor tenga el botón y el menú interno requeridos
    if (!btn || !menu) return;

    // Evita volver a adjuntar listeners de eventos en llamadas sucesivas
    if (dropdown.dataset.initialized) return;
    dropdown.dataset.initialized = 'true';

    // Al hacer clic en el botón se alternará la visibilidad del menú
    btn.addEventListener('click', (e) => {
      // Cierra cualquier otro dropdown abierto actualmente
      document.querySelectorAll('.dropdown-menu').forEach(m => {
        if (m !== menu) m.classList.add('hidden');
      });
      menu.classList.toggle('hidden');
      // Detiene la propagación para evitar que el manejador global del 'document' lo cierre de inmediato
      e.stopPropagation();
    });

    // Agrega listeners de clic a todas las opciones del dropdown
    dropdown.querySelectorAll('.dropdown-option').forEach(option => {
      option.addEventListener('click', async (e) => {
        e.stopPropagation();
        const value = option.getAttribute('data-value');
        menu.classList.add('hidden'); // Oculta el menú desplegable tras la selección
        
        // Ejecuta la acción callback especificada pasando los detalles correspondientes
        if (onSelectCallback) {
          await onSelectCallback(value, dropdown, option);
        }
      });
    });
  });

  // Configura un único manejador en el documento para cerrar cualquier dropdown al hacer clic fuera
  if (!window.dropdownClickOutsideInit) {
    document.addEventListener('click', () => {
      document.querySelectorAll('.dropdown-menu').forEach(m => m.classList.add('hidden'));
    });
    window.dropdownClickOutsideInit = true;
  }
}

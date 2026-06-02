export function initCustomDropdown(containerSelector, onSelectCallback) {
  document.querySelectorAll(containerSelector).forEach(dropdown => {
    const btn = dropdown.querySelector('.dropdown-btn');
    const menu = dropdown.querySelector('.dropdown-menu');
    
    if (!btn || !menu) return;

    if (dropdown.dataset.initialized) return;
    dropdown.dataset.initialized = 'true';

    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.dropdown-menu').forEach(m => {
        if (m !== menu) m.classList.add('hidden');
      });
      menu.classList.toggle('hidden');
      e.stopPropagation();
    });

    dropdown.querySelectorAll('.dropdown-option').forEach(option => {
      option.addEventListener('click', async (e) => {
        e.stopPropagation();
        const value = option.getAttribute('data-value');
        menu.classList.add('hidden');
        
        if (onSelectCallback) {
          await onSelectCallback(value, dropdown, option);
        }
      });
    });
  });

  if (!window.dropdownClickOutsideInit) {
    document.addEventListener('click', () => {
      document.querySelectorAll('.dropdown-menu').forEach(m => m.classList.add('hidden'));
    });
    window.dropdownClickOutsideInit = true;
  }
}

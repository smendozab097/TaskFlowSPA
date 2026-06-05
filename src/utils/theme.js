// ==========================================
// TEMA / MODO OSCURO (theme.js)
// Contiene la lógica para alternar entre el
// modo claro y el modo oscuro de la SPA.
// ==========================================

export function initThemeToggle() {
  // Selecciona el botón para alternar el tema
  const themeToggleBtn = document.getElementById('theme-toggle');
  if (!themeToggleBtn) return;

  // Escucha el clic en el botón
  themeToggleBtn.addEventListener('click', () => {
    // Si ya tiene la clase dark, la quita y guarda 'light'
    if (document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } 
    // Si no tiene la clase, la agrega y guarda 'dark'
    else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  });
}

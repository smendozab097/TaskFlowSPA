import Swal from 'sweetalert2';

// ----------------------------------------
// CONFIGURACIÓN DE ALERTAS (alerts.js)
// ----------------------------------------

// Guardamos la referencia a la función original de SweetAlert
const originalFire = Swal.fire;

// Sobrescribimos Swal.fire para inyectar automáticamente estilos que combinen
// con el tema actual (claro u oscuro) detectado en el documento html
Swal.fire = function(...args) {
    const isDark = document.documentElement.classList.contains('dark');
    
    // Configuramos los colores de fondo y texto basados en las clases de Tailwind (slate)
    const themeConfig = isDark ? {
        background: '#1e293b', // slate-800
        color: '#f1f5f9'       // slate-100
    } : {
        background: '#ffffff',
        color: '#545454'
    };

    // Si se recibe un objeto de configuración individual, fusionamos el tema antes de disparar
    if (args.length === 1 && typeof args[0] === 'object') {
        return originalFire({ ...themeConfig, ...args[0] });
    }
    
    // Para llamadas tradicionales con parámetros posicionales, delegamos sin cambios
    return originalFire(...args);
};

// Utilidad global para mostrar una alerta visual de denegación de permisos/acceso
export function showAccessDenied() {
    return Swal.fire({
        icon: 'warning',
        title: 'Acceso Denegado',
        text: 'No tienes permisos para acceder a esta sección.',
        confirmButtonColor: '#3b82f6'
    });
}

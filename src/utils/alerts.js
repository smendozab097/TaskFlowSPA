import Swal from 'sweetalert2';

const originalFire = Swal.fire;

Swal.fire = function(...args) {
    const isDark = document.documentElement.classList.contains('dark');
    const themeConfig = isDark ? {
        background: '#1e293b', // slate-800
        color: '#f1f5f9'       // slate-100
    } : {
        background: '#ffffff',
        color: '#545454'
    };

    if (args.length === 1 && typeof args[0] === 'object') {
        return originalFire({ ...themeConfig, ...args[0] });
    }
    
    return originalFire(...args);
};

export function showAccessDenied() {
    return Swal.fire({
        icon: 'warning',
        title: 'Acceso Denegado',
        text: 'No tienes permisos para acceder a esta sección.',
        confirmButtonColor: '#3b82f6'
    });
}

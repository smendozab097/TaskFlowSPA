import routes from './routes.js';
import { renderNotFound } from '../views/not-found.js';
import { getSession } from '../services/auth.service.js';
import { showAccessDenied } from '../utils/alerts.js';

export const renderRouter = async () => {
    const app = document.getElementById('app');
    if (!app) return console.error('No se encontró el id "app"');

    const currentPath = window.location.pathname;

    // Si la ruta no existe en el diccionario, renderiza notFound
    const route = routes[currentPath] ?? { render: renderNotFound };

    // --- Seguridad y Guards ---
    const user = getSession();

    // 1. Guard: Autenticación requerida
    if (route.requiresAuth && !user) {
        history.pushState(null, null, '/login');
        return renderRouter();
    }

    // 2. Guard: Redirección si ya está autenticado (evita ver Login/Register de nuevo)
    if (user && route.redirectIfAuthenticated) {
        history.pushState(null, null, '/dashboard');
        return renderRouter();
    }

    // 3. Guard: Autorización de roles (allowedRoles)
    if (route.allowedRoles && user) {
        const hasPermission = route.allowedRoles.some(role => user.role && user.role.includes(role));
        if (!hasPermission) {
            console.warn(`Usuario no autorizado para entrar a: ${currentPath}`);
            await showAccessDenied();
            history.pushState(null, null, '/dashboard');
            return renderRouter();
        }
    }
    // ---------------------------
    if (route.title) {
        document.title = route.title;
    }
    // 4. Renderizamos la vista
    app.innerHTML = route.render();

    // 5. Ejecutamos la inicialización de la vista
    if (route.init) {
        await route.init();
    }
};

export const initRouter = () => {
    // Soporte para las flechas Atrás/Adelante del navegador
    window.addEventListener('popstate', renderRouter);

    // Interceptamos los clics en enlaces SPA
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a[data-link]');
        if (link) {
            e.preventDefault();
            const href = link.getAttribute('href');
            history.pushState(null, null, href);
            renderRouter();
        }
    });

    // Primera carga al abrir la página
    renderRouter();
};
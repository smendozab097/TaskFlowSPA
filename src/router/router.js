import routes from './routes.js';
import { renderNotFound } from '../views/not-found.js'; // Tomado de la idea de tu TL

export const renderRouter = async () => {
    const app = document.getElementById('app');
    if (!app) return console.error('No se encontró el id "app"');

    const currentPath = window.location.pathname;
    
    // 1. Elegancia del TL: Si la ruta no existe en el diccionario, renderiza notFound
    const route = routes[currentPath] ?? { render: renderNotFound };

    // --- 2. Seguridad (Lo que añadimos nosotros) ---
    const sessionData = localStorage.getItem('currentUser');
    const user = sessionData ? JSON.parse(sessionData) : null;

    if (route.requiresAuth && !user) {
        history.pushState(null, null, '/login');
        return renderRouter(); // Volvemos a ejecutar para renderizar el login
    }
    // -----------------------------------------------

    // 3. Renderizamos la vista
    app.innerHTML = route.render();

    // 4. Ejecutamos el setup (como lo llama tu TL) o init
    if (route.init) {
        await route.init();
    }
};

export const initRouter = () => {
    // 1. Soporte para las flechas Atrás/Adelante del navegador (CRÍTICO)
    window.addEventListener('popstate', renderRouter);

    // 2. Interceptamos los clics en enlaces (La lógica del TL)
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a[data-link]'); // Selector muy eficiente
        if (link) {
            e.preventDefault();
            const href = link.getAttribute('href');
            history.pushState(null, null, href);
            
            // Llamamos a renderRouter sin pasarle la ruta, 
            // ella misma leerá el window.location actualizado.
            renderRouter(); 
        }
    });

    // 3. Primera carga al abrir la página
    renderRouter();
};
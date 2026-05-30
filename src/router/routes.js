import { renderHome, initHome } from "../views/home.js";
import { renderRegister, initRegister } from "../views/auth/register.js";
import { renderLogin, initLogin } from "../views/auth/login.js";
import { renderDashboard, initDashboard } from "../views/dashboard.js";
import { renderTasks, initTasks } from "../views/tasks/tasks.js";
import { renderTaskForm, initTaskForm } from "../views/tasks/task-form.js";
import { renderProfile, initProfile } from "../views/users/profile.js";
import { renderAdmin, initAdmin } from "../views/users/admin.js";

const routes = {
    "/": {
        render: renderHome,
        init: initHome,
        title: "Inicio | TaskFlowSPA",
        requiresAuth: false
    },
    "/login": {
        render: renderLogin,
        init: initLogin,
        title: "Iniciar Sesion | TaskFlowSPA",
        requiresAuth: false,
        redirectIfAuthenticated: true
    },
    "/register": {
        render: renderRegister,
        init: initRegister,
        title: "Registrarse | TaskFlowSPA",
        requiresAuth: false,
        redirectIfAuthenticated: true
    },
    "/dashboard": {
        render: renderDashboard,
        init: initDashboard,
        requiresAuth: true,
        title: "Dashboard | TaskFlowSPA",
    },
    "/tasks": {
        render: renderTasks,
        init: initTasks,
        requiresAuth: true,
        title: "Mis Tareas | TaskFlowSPA"
    },
    "/task-form": {
        render: renderTaskForm,
        init: initTaskForm,
        requiresAuth: true,
        title: "Gestionar Tarea | TaskFlowSPA"
    },
    "/profile": {
        render: renderProfile,
        init: initProfile,
        requiresAuth: true,
        title: "Mi Perfil | TaskFlowSPA"
    },
    "/admin": {
        render: renderAdmin,
        init: initAdmin,
        requiresAuth: true,
        allowedRoles: ["ADMIN"],
        title: "Panel de Administracion | TaskFlowSPA"
    }
};

export default routes;
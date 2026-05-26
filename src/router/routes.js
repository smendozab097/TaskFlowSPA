import { renderHome } from "../views/home";
import { renderRegister } from "../views/register";


const routes = {
    "/": {
        render: renderHome,
        isPublic: true
    },
    "/login": {
        render: renderLogin,
        isPublic: true
    },
    "/register": {
        render: renderRegister,
        isPublic: true
    },
    "/dashboard": {
        render: renderDashboard,
        requiresAuth: true
    },
    "/tasks": {
        render: renderTasks,
        requiresAuth: true
    },
    "/profile": {
        render: renderProfile,
        requiresAuth: true
    },
    "/admin": {
        render: renderAdmin,
        requiresAuth: true
    }
}
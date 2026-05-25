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
        render: renderDashboard
    },
    "/tasks": {
        render: renderTasks
    },
    "/profile": {
        render: renderProfile
    },
    "/admin": {
        render: renderAdmin
    }
}
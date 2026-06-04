# Informe de Análisis del Proyecto: TaskFlowSPA

Este informe presenta un análisis exhaustivo del estado actual del proyecto **TaskFlowSPA**, evaluando su arquitectura, el flujo de navegación, la gestión de autenticación, la seguridad de las rutas y el consumo del backend fake.

---

## 1. Estado Actual del Proyecto

El proyecto está estructurado como una **Single Page Application (SPA)** con JavaScript Vanilla utilizando Vite como empaquetador y Tailwind CSS v4 para la interfaz visual. Se conecta a un backend simulado (`json-server`) ubicado en el directorio hermano `TASKFLOWAPI`.

### Estructura de Archivos Detectada
```text
TaskFlowSPA/
├── src/
│   ├── main.js             # Punto de entrada de la SPA
│   ├── router/
│   │   ├── router.js       # Motor de renderizado y lógica de guards básicos
│   │   └── routes.js       # Definición del diccionario de rutas
│   ├── views/              # Vistas principales de la aplicación
│   │   ├── home.js
│   │   ├── login.js
│   │   ├── register.js
│   │   ├── dashboard.js
│   │   ├── tasks.js
│   │   ├── task-form.js
│   │   ├── profile.js
│   │   ├── admin.js
│   │   └── not-found.js
│   ├── services/           # Conectores HTTP con json-server
│   │   ├── auth.service.js
│   │   ├── users.service.js
│   │   └── tasks.service.js
│   └── styles/
│       └── global.css      # Estilos de Tailwind CSS v4
```

---

## 2. Hallazgos Clave y Problemas Detectados

A pesar de tener una base visual y estructural muy bien encaminada, existen varias inconsistencias técnicas, bugs lógicos y brechas de seguridad que deben resolverse para lograr una SPA madura.

### A. Seguridad y Control de Acceso (Rutas)
*   **Falta de validación de roles en los Guards**: Aunque en `routes.js` la ruta `/admin` especifica `allowedRoles: ["ADMIN"]`, el enrutador (`router.js`) **no valida esta propiedad**. Cualquier usuario autenticado con rol `USER` puede acceder directamente al panel administrativo escribiendo `/admin` en la barra de direcciones o mediante enlaces.
*   **Propiedad `redirectIfAuthenticated` sin implementar**: En `routes.js` se marca esta propiedad como `true` para `/login` y `/register`, pero en `router.js` no se evalúa. Un usuario ya autenticado puede seguir viendo las pantallas de Login y Registro sin ser redirigido automáticamente a su Dashboard.

### B. Flujo de Autenticación y Sesión
*   **Servicio `auth.service.js` roto y sin usar**:
    *   Este archivo no se importa en ninguna parte del proyecto.
    *   Tiene un error de sintaxis en `getSession`: intenta usar la variable `key` (en minúscula) pero está definida como `Key` (en mayúscula), lo que causaría un `ReferenceError`.
    *   `deleteSession` ejecuta `localStorage.removeItem()` sin argumentos, lo cual es incorrecto.
    *   Toda la aplicación accede directamente a `localStorage.getItem('currentUser')` de forma cruda, violando las directrices de `AGENTS.md` de encapsular este acceso en un servicio.
*   **Logout incompleto y roto**: El enlace de "Cerrar sesión" en `dashboard.js` es un simple `<a href="/login">Logout</a>` sin atributo `data-link` ni controlador de eventos. Esto provoca una recarga completa de la página y **no borra la sesión del usuario** (`currentUser`) de `localStorage`.
*   **Bug en el Registro de usuarios**: Al registrarse con éxito, `register.js` redirige al usuario a `/dashboard`, pero **no inicia sesión automáticamente** (no guarda al usuario registrado en `localStorage`). Al procesar la ruta `/dashboard`, el router detecta que no hay sesión activa y vuelve a expulsar al usuario redirigiéndolo a `/login`.

### C. Navegación SPA y Experiencia de Usuario
*   **Recargas completas de página (Links rotos)**: Muchos de los enlaces en las cabeceras (`<header>`) de `dashboard.js` y otras vistas no incluyen el atributo `data-link`. Al hacer clic en ellos, el navegador realiza una recarga HTTP tradicional de la página completa, rompiendo el flujo SPA.
*   **Falta de Componentes Reutilizables**: La cabecera de navegación (`<header>`) con la barra de navegación se duplica exactamente en `dashboard.js`, `tasks.js`, `task-form.js`, `profile.js` y `admin.js`. Esto dificulta el mantenimiento (por ejemplo, si se desea ocultar el botón de "Admin" para un usuario común, se debe cambiar en cada uno de los archivos individualmente).

### D. Calidad de Código
*   **Nomenclatura confusa en servicios**: En `tasks.service.js`, la función `getTaskById(userId)` usa el nombre de parámetro `userId` pero en realidad consulta tareas por su ID único (`taskId`). Esto genera confusión al programar.

---

## 3. Plan de Mejoras Recomendado

Para llevar el proyecto a un estado de éxito completo, se proponen las siguientes mejoras divididas por prioridad:

### 🔴 MUST (Prioridad Alta - Funcionalidad Básica y Seguridad)

1.  **Corregir Seguridad del Router (Guards)**
    *   Implementar la verificación de `allowedRoles` en `router.js`. Si un usuario no tiene el rol necesario para la ruta, redirigirlo (por ejemplo, al Dashboard o a una página 403 / No Autorizado).
    *   Implementar la lógica para `redirectIfAuthenticated`. Redirigir a `/dashboard` si un usuario autenticado intenta entrar a `/login` o `/register`.
2.  **Arreglar el Cierre de Sesión (Logout)**
    *   Implementar una función de cierre de sesión real que elimine `currentUser` de `localStorage` y luego use `history.pushState` para ir a `/login` sin recargar la página.
3.  **Sanear e Integrar `auth.service.js`**
    *   Corregir los errores de variables y métodos de `auth.service.js`.
    *   Reemplazar todas las llamadas directas a `localStorage.getItem('currentUser')` y `localStorage.setItem('currentUser')` por los métodos correspondientes del servicio (`getSession`, `createSession`, `deleteSession`).
4.  **Corregir el flujo de Registro**
    *   Modificar `register.js` para que guarde al usuario creado en `localStorage` (haciendo login automático) antes de redirigir a `/dashboard`, o bien redirigirlo a `/login` con un mensaje de éxito.

### 🟡 SHOULD (Prioridad Media - Calidad de Arquitectura y Usabilidad SPA)

1.  **Crear el Componente `Header` Reutilizable**
    *   Crear un componente en `src/components/Header.js` que renderice la barra de navegación dinámicamente.
    *   Debe leer el rol del usuario actual: si no es `ADMIN`, no debe mostrar el enlace al panel de administración.
    *   Debe adjuntar el listener para manejar el botón de Logout programáticamente.
2.  **Asegurar que toda la Navegación sea SPA (`data-link`)**
    *   Revisar todos los archivos de vistas y asegurarse de que todos los enlaces internos contengan el atributo `data-link` para evitar recargas del navegador.
3.  **Refactorizar Nombres en Servicios**
    *   Corregir la firma de `getTaskById` en `tasks.service.js` cambiando `userId` por `id` o `taskId`.

### 🟢 NICE TO HAVE (Prioridad Baja - Estética y Pulido Visual)

1.  **Clase Activa en Navegación**
    *   En el componente `Header`, identificar la ruta actual (`window.location.pathname`) y aplicar clases visuales distintas (por ejemplo, un fondo azul sólido o texto en negrita) al enlace de la página activa para mejorar el feedback visual de ubicación del usuario.
2.  **Notificaciones Visuales (Toasts) en lugar de Alerts**
    *   Reemplazar los `alert()` y `confirm()` nativos del navegador por un sistema de notificaciones moderno integrado en la SPA (toasts elegantes utilizando Tailwind CSS).
3.  **Limpieza del Espacio de Trabajo**
    *   Borrar las carpetas vacías dentro de `src/views/` (`auth/`, `tasks/`, `users/`) o estructurar la colocación de las vistas dentro de ellas para mantener el proyecto limpio.

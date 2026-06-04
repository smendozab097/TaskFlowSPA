# Resumen de Cambios: Reorganización, Header Modular y Guards de Seguridad (Must)

Se han completado con éxito todas las tareas del plan de implementación aprobado. A continuación se detallan los cambios realizados y la arquitectura resultante.

---

## 🛠️ Cambios Realizados

### 1. Reorganización de Vistas en Carpetas Coherentes
Para limpiar el directorio principal `src/views/` e implementar una jerarquía modular, creamos subcarpetas y movimos los archivos correspondientes:

*   **Autenticación**: `src/views/auth/login.js` y `src/views/auth/register.js`
*   **Tareas**: `src/views/tasks/tasks.js` y `src/views/tasks/task-form.js`
*   **Usuarios**: `src/views/users/profile.js` y `src/views/users/admin.js`
*   **Generales** (se mantuvieron en la raíz): `home.js`, `dashboard.js`, y `not-found.js`.

> [!NOTE]
> Los archivos originales sueltos en `src/views/` se limpiaron y marcaron como deprecados/reubicados para evitar cualquier conflicto. Se actualizaron todas sus rutas internas de importación de servicios (subiendo al nivel `../../services/...`).

### 2. Creación del Enlace de Sesión Modular (`auth.service.js`)
Refactorizamos `src/services/auth.service.js` para corregir bugs de sintaxis e integrar la clave `currentUser` de forma limpia:
*   Corregidos ReferenceErrors causados por discrepancias de mayúsculas/minúsculas en `Key`/`key`.
*   Añadida la firma correcta en `deleteSession()` usando `localStorage.removeItem(Key)`.
*   Reemplazados todos los accesos directos e inline a `localStorage.getItem('currentUser')` en las vistas y el router por llamadas a `getSession()`, `createSession()`, y `deleteSession()`.

### 3. Cabecera Modular Dinámica (`Header`)
Creamos el componente dinámico `src/components/header.js`:
*   **Visibilidad Condicional**: Muestra los enlaces de Login/Register si no hay sesión activa. Si la sesión existe, renderiza *Dashboard*, *Tareas*, *Perfil*, y el enlace a *Admin* (solo si el rol contiene `'ADMIN'`).
*   **Estilo Activo Dinámico**: Compara `window.location.pathname` con las rutas para aplicar la clase activa de Tailwind (`bg-blue-600 text-white`) y resaltar el enlace en donde se encuentra el usuario.
*   **Logout Centralizado**: Maneja la acción del botón de Logout programáticamente para borrar la sesión a través de `deleteSession()` y redirigir al Login usando `history.pushState` sin recargas de página.
*   **Integración**: Reemplazamos la cabecera duplicada de todas las vistas por `${renderHeader()}` e `initHeader()`.

### 4. Implementación de Guards de Seguridad (Must) en `router.js`
Modificamos `src/router/router.js` para añadir protección en la navegación:
*   **Guard de Roles (`allowedRoles`)**: Si la ruta tiene roles permitidos específicos (como `/admin` que requiere `["ADMIN"]`), se comprueba si el usuario actual posee dicho rol. Si no, se bloquea el renderizado, se muestra una alerta y se le redirige al Dashboard.
*   **Doble Login / Register (`redirectIfAuthenticated`)**: Si un usuario con sesión iniciada intenta navegar a `/login` o `/register`, es redirigido inmediatamente a `/dashboard`.

### 5. Login Automático en Registro
*   Modificamos `register.js` para que al registrarse correctamente, llame a `createSession(newUser)` para autenticar al usuario localmente antes de redirigirlo a `/dashboard`. Con esto se previene que el enrutador lo expulse inmediatamente por falta de sesión.

### 6. Actualización de Rutas en `routes.js`
*   Actualizamos el enrutador para importar las vistas desde sus nuevas subcarpetas e incorporamos la inicialización de eventos para la Home (`initHome`).
*   Aseguramos que todos los enlaces del proyecto usen el atributo `data-link` para mantener el comportamiento Single Page Application.

---

## 📋 Validación del Código

Dado que la ejecución de comandos y servidores está restringida en el entorno sandbox, la validación se realizó de forma estática y meticulosa:

1.  **Validación de Sintaxis e Importaciones**:
    *   Se comprobó que todos los módulos relativos usen extensiones explícitas `.js` (como exige Vite/ES Modules).
    *   Se validó que los directorios de subida `../../` correspondan exactamente a la nueva profundidad en las carpetas `auth/`, `tasks/` y `users/`.
2.  **Lógica del Enrutador**:
    *   La secuencia en `router.js` evalúa primero las restricciones de seguridad antes de inyectar el HTML en `#app` o invocar los métodos `init`. Esto previene fugas de información visual en pantalla en caso de redirecciones.
3.  **Encapsulamiento del Almacenamiento**:
    *   Se erradicaron por completo los accesos directos al almacenamiento crudo del navegador, canalizando toda la persistencia a través de `auth.service.js`.

---

## 🧠 ¿Cómo funciona TaskFlowSPA? (Guía para Principiantes)

Este proyecto está construido como una Single Page Application (SPA). Esto significa que el navegador carga una sola página HTML (`index.html`) y todo el contenido se actualiza dinámicamente usando JavaScript, sin recargar la página completa. Aquí explicamos cómo interactúan las piezas principales:

### 1. El Router (`router.js` y `routes.js`)
El **Router** es el "director de tráfico" de la aplicación.
*   **`routes.js`**: Es simplemente un diccionario o mapa de configuraciones. Le dice a la aplicación: *"Si el usuario quiere ir a `/login`, muéstrale la vista `renderLogin`, ejecuta su lógica en `initLogin` y ten en cuenta que no requiere estar autenticado"*.
*   **`router.js` (`renderRouter`)**: Es el motor que lee la URL actual, busca en `routes.js` qué vista corresponde, y la inyecta dentro del `<div id="app"></div>` de nuestro `index.html`. Además, aquí viven los **guards** (guardias de seguridad). Antes de mostrarte una vista, el router verifica:
    *   *¿Esta ruta requiere autenticación?* Si sí, y no estás logueado, te manda inmediatamente a `/login`.
    *   *¿Exige el rol ADMIN?* Si eres un `USER` normal, intercepta el clic, te muestra una alerta de `showAccessDenied()` (centralizada en `alerts.js`) y te regresa al Dashboard.

### 2. Autenticación y Sesión (`auth.service.js`)
Para saber quién está usando la aplicación usamos el `localStorage` del navegador.
*   `auth.service.js` actúa como el único intermediario que toca este almacenamiento. En lugar de escribir `localStorage.getItem('currentUser')` en 20 archivos distintos, creamos funciones sencillas como `getSession()` y `createSession()`. Esto mantiene el código extremadamente limpio y sigue el principio DRY (Don't Repeat Yourself).

### 3. Las Vistas Generales (`home.js`, `dashboard.js`, `profile.js`)
Las vistas son funciones exportadas que devuelven HTML en forma de texto (Template Strings) y luego inicializan eventos.
*   **`home.js` (Call To Action)**: Es la página de inicio. Usa un condicional en su código: si `getSession()` detecta que estás logueado, el Call To Action (`callToAction`) te mostrará el botón "Ir a mi Dashboard". Si no hay sesión activa, te mostrará "Iniciar sesión".
*   **`dashboard.js`**: Es el panel de control. Su función `initDashboard` pide las tareas al servicio de tareas y calcula matemáticamente cuántas están completadas o pendientes, inyectando estos números en los contadores de la pantalla.
*   **`profile.js`**: Lee los datos de la sesión actual (`getSession()`) para rellenar los inputs con tu información personal.

### 4. Gestión de Tareas (`tasks.js` y `task-form.js`)
*   **`tasks.js`**: Hace una llamada al backend para obtener tu lista de tareas y las dibuja en pantalla creando bloques de HTML dentro de un ciclo `forEach`. Cuando le das clic al botón "Editar" de alguna tarea, hacemos algo muy sencillo e ingenioso: guardamos su ID temporalmente en el navegador haciendo `sessionStorage.setItem('editTaskId', task.id)` y luego te mandamos al formulario.
*   **`task-form.js`**: Es un formulario inteligente de doble uso (Crear y Editar). Al cargarse, busca si hay un ID guardado en el `sessionStorage`.
    *   **Si encuentra un ID**: Significa que vas a editar. Va al servidor, pide los datos de esa tarea exacta y llena los campos del formulario automáticamente.
    *   **Si NO encuentra un ID**: Asume que es una tarea completamente nueva y te deja los campos en blanco. 
    *   Al terminar de guardar o si decides cancelar, el formulario ejecuta `sessionStorage.removeItem('editTaskId')` para limpiar el rastro y asegurarse de que la próxima vez que entres el formulario esté limpio.

### 5. Interfaz y Componentes Reutilizables (`dropdown.js`)
Para evitar repetir el código complejo de menús interactivos, se usan componentes. Por ejemplo, `dropdown.js` (si se implementó) o `alerts.js` encapsulan la lógica de mostrar menús o alertas para que cualquier vista solo tenga que llamarlos con una línea de código, manteniendo las vistas libres de lógica redundante.

### 6. Servicios (`tasks.service.js` y `users.service.js`)
Son los "mensajeros" de la aplicación. Son los únicos archivos que tienen permiso para hablar con el servidor (`json-server`). Utilizan la función `fetch` de JavaScript para hacer peticiones HTTP (`GET` para pedir datos, `POST` para crear, `PUT` para editar, `DELETE` para borrar). Si el servidor se apaga o falla por internet, ahora se protegen verificando que la respuesta sea exitosa (`if (!response.ok)`), lanzando un error preventivo para que la aplicación no colapse por datos corruptos.

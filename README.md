# TaskFlowSPA

TaskFlowSPA es una aplicacion web tipo SPA (Single Page Application) construida con JavaScript Vanilla, HTML, CSS y Tailwind CSS. Su objetivo es simular un sistema moderno de gestion de tareas y productividad mientras sirve como base practica para aprender arquitectura frontend sin depender de frameworks como React, Vue o Angular.

La aplicacion usara routing del lado del cliente con History API para navegar entre vistas sin recargar toda la pagina, integrando autenticacion, autorizacion por roles, proteccion de rutas, renderizado dinamico y persistencia de datos con un backend fake basado en `json-server`.

Para simplificar la autenticacion en esta primera SPA, la sesion activa del usuario se manejara con `localStorage`, mientras que `json-server` se utilizara para los datos persistentes del sistema.

## Objetivo del proyecto

Este proyecto esta pensado para practicar fundamentos clave del desarrollo frontend moderno:

- Routing SPA.
- Arquitectura frontend modular.
- Separacion de responsabilidades.
- Manejo de estado basico.
- Guards y proteccion de rutas.
- Reutilizacion de componentes.
- Escalabilidad en Vanilla JS.

## Tipo de arquitectura

Este proyecto usara una arquitectura frontend simple por capas (`layered architecture`) adaptada a una SPA en JavaScript Vanilla.

La idea es separar la aplicacion por responsabilidades para que sea mas facil de aprender, mantener y escalar poco a poco:

- `main.js` como punto de arranque.
- `router/` para la navegacion SPA.
- `views/` para las pantallas principales.
- `components/` para piezas reutilizables.
- `services/` para datos, sesion y comunicacion con el backend fake.
- `utils/` para funciones auxiliares.
- `styles/` para estilos globales y apoyo visual.

Esta decision busca que el equipo entienda primero como funciona una SPA antes de pasar a arquitecturas mas avanzadas o mas modulares por dominio.

## Stack principal

- JavaScript Vanilla
- HTML5
- CSS3
- Tailwind CSS
- Vite
- JSON Server como backend fake

## Funcionalidades previstas

- Inicio de sesion y cierre de sesion.
- Manejo de sesion del usuario.
- Rutas publicas y privadas.
- Sistema de roles y permisos.
- Navegacion SPA con `History API`.
- Renderizado dinamico de vistas.
- Componentes reutilizables.
- CRUD completo de tareas.
- Edicion de perfil del usuario autenticado.
- Eliminacion de la propia cuenta por parte del usuario autenticado.
- Dashboard principal con estadisticas basicas.
- Panel administrativo para usuarios `ADMIN`.
- Consumo de datos desde un backend fake con `json-server`.

## Roles iniciales

### `ADMIN`

- Puede gestionar usuarios.
- Puede visualizar todas las tareas.
- Puede modificar roles y permisos.
- Tiene acceso completo al sistema.

### `USER`

- Puede crear, editar y eliminar sus propias tareas.
- Puede visualizar solo la informacion relacionada con su cuenta.
- Puede editar su propio perfil.
- Puede eliminar su propia cuenta.

## Alcance funcional esperado

La SPA deberia incluir, como minimo, los siguientes modulos o vistas:

- `Login`
- `Dashboard`
- `Mis tareas`
- `Mi perfil`
- `Detalle o formulario de tarea`
- `Administracion de usuarios` solo para `ADMIN`
- `Pagina 404`

## Estructura sugerida

La estructura inicial del proyecto sera sencilla y progresiva:

```text
src/
  main.js
  router/
  views/
  components/
  services/
  utils/
  styles/
```

### Principios de arquitectura

- Cada modulo debe encargarse de una responsabilidad clara.
- Las vistas no deben contener toda la logica de negocio.
- El acceso al backend debe centralizarse en `services`.
- La logica de permisos debe aislarse en el sistema de routing o en utilidades de autorizacion.
- Los componentes compartidos deben ser reutilizables y faciles de identificar.
- Las vistas deben apoyarse en Tailwind CSS para mantener consistencia visual y velocidad de construccion.

## Flujo general de navegacion

1. El usuario entra a la aplicacion.
2. Si no tiene sesion activa, ve la vista de `login`.
3. Tras autenticarse, la sesion se guarda en `localStorage`.
4. El router redirige segun su estado de sesion y permisos.
5. Al recargar la app, la sesion se restaura desde `localStorage`.
6. Las rutas administrativas validan autenticacion y rol `ADMIN`.
7. Al cerrar sesion, los datos de sesion se eliminan del `localStorage`.

## Reglas de negocio base

- Un `USER` solo puede manipular sus propias tareas.
- Un `USER` solo puede editar su propio perfil.
- Un `USER` puede eliminar su propia cuenta.
- Un `ADMIN` puede ver y administrar todas las tareas y usuarios.
- Las rutas privadas no deben renderizarse si no existe una sesion valida.
- El estado de autenticacion debe persistirse de forma controlada en `localStorage`.

## Scripts disponibles

- `npm run dev`: levanta el entorno de desarrollo con Vite.
- `npm run build`: genera la version de produccion.
- `npm run preview`: sirve localmente el build generado.

## Inicio rapido

1. Instala dependencias:

```bash
npm install
```

2. Inicia la app en desarrollo:

```bash
npm run dev
```

3. En paralelo, cuando se agregue el backend fake, inicia `json-server` con el archivo de datos definido para el proyecto.

## Backend fake

La persistencia de datos del sistema estara basada en `json-server`. La idea es simular recursos como:

- `users`
- `tasks`

Ejemplo de responsabilidades del backend fake:

- Consultar usuarios.
- Validar credenciales de manera simulada.
- Consultar y actualizar perfil del usuario autenticado.
- Eliminar la cuenta del usuario autenticado.
- Obtener tareas por usuario.
- Crear, editar y eliminar tareas.
- Permitir consultas globales para administracion.

## Manejo de sesion

Para mantener el proyecto simple y enfocado en el aprendizaje:

- `json-server` se usara para `users` y `tasks`.
- `localStorage` se usara para guardar la sesion activa.
- No se manejara una coleccion `sessions` en el backend fake como parte del flujo principal.

Esto permite practicar autenticacion SPA sin agregar complejidad innecesaria en esta primera etapa.

## Criterios tecnicos del proyecto

- No usar frameworks SPA.
- Mantener una arquitectura simple por capas desde el inicio.
- Evitar mezclar DOM, reglas de negocio y acceso a datos en un mismo archivo.
- Priorizar codigo legible, escalable y facil de mantener.

## Estado actual

El proyecto se encuentra **completamente implementado** y funcional, cumpliendo con la arquitectura por capas y las metas pedagógicas:

1. **Router SPA (`router/`)**: Sistema de rutas dinámicas implementado mediante la History API (`pushState` y evento `popstate`), con guards de seguridad que restringen el acceso a rutas privadas para usuarios no autenticados y vistas administrativas solo para el rol `ADMIN`.
2. **Layout base (`components/`)**: Cabecera interactiva y adaptativa (`header.js`) con soporte de tema claro/oscuro e indicador de sesión activa.
3. **Módulo de Autenticación (`views/auth/`)**: Formulario de inicio de sesión (`login.js`) y registro de nuevos usuarios (`register.js`), con persistencia de sesión activa en `localStorage`.
4. **Módulo de Tareas (`views/tasks/`)**: CRUD completo de tareas (listado, creación, edición y eliminación) sincronizado con el backend a través de `services/tasks.service.js`.
5. **Dashboard (`views/dashboard.js`)**: Panel visual con métricas y resúmenes de tareas completadas, pendientes y activas en tiempo real.
6. **Panel Administrativo (`views/users/admin.js`)**: Exclusivo para administradores. Permite visualizar a todos los usuarios registrados, modificar sus roles dinámicamente mediante un dropdown personalizado y eliminar cuentas de usuario.
7. **Servicios (`services/`)**: Módulos dedicados para encapsular las peticiones HTTP (Fetch API) a la base de datos simulada y el manejo de almacenamiento local.
8. **Utilidades (`utils/`)**: Helpers para el manejo del tema (`theme.js`), dropdowns personalizados (`dropdown.js`) e interceptor estético de alertas (`alerts.js`).

---

## Instrucciones para Ejecutar el Proyecto

Para poner en marcha la aplicación, debes ejecutar tanto el servidor de desarrollo del frontend (SPA) como la API simulada (Backend fake).

### Requisitos previos
- Tener instalado [Node.js](https://nodejs.org/) (versión 16 o superior recomendada).

### 1. Iniciar la API (Backend fake)
La API se encuentra en la carpeta `TaskFlowAPI`, la cual está al mismo nivel que la carpeta de este proyecto (`TaskFlowSPA`).

1. Abre una terminal nueva.
2. Navega hacia la carpeta `TaskFlowAPI`:
   ```bash
   cd ../TaskFlowAPI
   ```
3. Ejecuta `json-server` apuntando al archivo `db.json` para levantar el servidor de datos en el puerto `3000`:
   ```bash
   npx json-server db.json
   ```
   *Nota: Por defecto, json-server se ejecutará en http://localhost:3000.*

### 2. Iniciar la SPA (Frontend)
El código de la interfaz de usuario se encuentra en esta carpeta (`TaskFlowSPA`).

1. Abre una segunda terminal.
2. Asegúrate de estar dentro del directorio de la aplicación (`TaskFlowSPA`).
3. Instala las dependencias necesarias (si es la primera vez que lo ejecutas):
   ```bash
   npm install
   ```
4. Inicia el servidor de desarrollo de Vite:
   ```bash
   npm run dev
   ```
5. Abre la dirección que te proporcione la terminal (generalmente `http://localhost:5173` o similar) en tu navegador para interactuar con la aplicación.

---

## Licencia

Este proyecto se distribuye bajo la licencia incluida en [`LICENSE`](./LICENSE).

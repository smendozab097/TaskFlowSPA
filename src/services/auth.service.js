// ----------------------------------------
// SERVICIO DE AUTENTICACIÓN
// Centraliza la persistencia y gestión de la sesión de usuario activa en el cliente.
// ----------------------------------------

// Clave en localStorage para almacenar el objeto de usuario
const Key = "currentUser";

// Guarda los datos del usuario recién autenticado convirtiéndolos a una cadena JSON
export const createSession = (usuario) => {
    localStorage.setItem(Key, JSON.stringify(usuario));
};

// Recupera y parsea los datos de sesión activa; retorna null si no hay sesión iniciada
export const getSession = () => {
    const sessionJSON = localStorage.getItem(Key);
    return sessionJSON ? JSON.parse(sessionJSON) : null;
};

// Remueve la clave de sesión del almacenamiento local (útil durante el Logout)
export const deleteSession = () => {
    localStorage.removeItem(Key);
};
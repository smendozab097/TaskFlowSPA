const Key = "currentUser";

export const createSession = (usuario) => {
    localStorage.setItem(Key, JSON.stringify(usuario));
};

export const getSession = () => {
    const sessionJSON = localStorage.getItem(Key);
    return sessionJSON ? JSON.parse(sessionJSON) : null;
};

export const deleteSession = () => {
    localStorage.removeItem(Key);
};
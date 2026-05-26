const endpointUser = "http://localhost:3000/users";

export async function getUsers() {
    const response = await fetch(endpointUser);
    const data = await response.json();
    return data;
}

export async function createUser(usuario) {
    const response = await fetch(endpointUser, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(usuario)
    });
    return response;
}

export async function getUserById(id) {
    const response = await fetch(`${endpointUser}/${id}`);
    const data = await response.json();
    return data;
}

export async function updateUser(id, updatedData) {
    const response = await fetch(`${endpointUser}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedData)
    });
    return response;
}

export async function deleteUser(id) {
    const response = await fetch(`${endpointUser}/${id}`, {
        method: "DELETE"
    });
    return response;
}


const endpointTask = "http://localhost:3000/tasks";

export async function getTasks() {
    const response = await fetch(endpointTask);
    const data = await response.json();
    return data;
}

export async function createTask(task) {
    const response = await fetch(endpointTask, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(task)
    });
    return response;
}

export async function getTaskById(id) {
    const response = await fetch(`${endpointTask}/${id}`);
    const data = await response.json();
    return data;
}

export async function updateTask(id, updatedData) {
    const response = await fetch(`${endpointTask}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedData)
    });
    return response;
}

export async function deleteTask(id) {
    const response = await fetch(`${endpointTask}/${id}`, {
        method: "DELETE"
    });
    return response;
}
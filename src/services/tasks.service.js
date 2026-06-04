const endpointTask = "http://localhost:3000/tasks";

export async function getTasks(userid) {
    // Si la funcion recibe un userid, le agregamos el filtro a la URL.
    // Si no recibe nada (undefined), usamos el endpoint normal para traer todo.
    const url = userid ? `${endpointTask}?userid=${userid}` : endpointTask;
    
    const response = await fetch(url); 
    if (!response.ok) throw new Error('API request failed');
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
    if (!response.ok) throw new Error('API request failed');
    return response;
}

export async function getTaskById(taskId) {
    const response = await fetch(`${endpointTask}/${taskId}`);
    if (!response.ok) throw new Error('API request failed');
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
    if (!response.ok) throw new Error('API request failed');
    return response;
}

export async function deleteTask(id) {
    const response = await fetch(`${endpointTask}/${id}`, {
        method: "DELETE"
    });
    if (!response.ok) throw new Error('API request failed');
    return response;
}
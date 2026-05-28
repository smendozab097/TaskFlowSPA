


const Key = "Actual_Session"

export const createSession = (usuario) =>{
    localStorage.setItem(Key, JSON.stringify(usuario))
}

export const getSession = (usuario) =>{
    const sessionJSON = localStorage.getItem(key)
    return JSON.parse(sessionJSON)
}

export const deleteSession = ()=> {
    localStorage.removeItem()
}
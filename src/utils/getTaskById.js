export function getTaskById(tasks, id){
    return tasks.find(task => task.id === id)
}
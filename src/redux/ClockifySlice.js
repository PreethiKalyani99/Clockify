import { createSlice } from "@reduxjs/toolkit";

export const ClockifySlice = createSlice({
    name: 'clockify',
    initialState: {
        projectClient: {},
        tasks: [],
        uniqueId: JSON.parse(localStorage.getItem('uniqueId')) || 0,
        tasksByWeek: {},
        isModalOpen: false,
        currentTask: {
            startTime: new Date().toString(),
            endTime: new Date().toString(),
            duration: '00:00:00',
            taskName: '',
            project: '',
            client: '' 
        }
    },
    reducers: {
        addTodayTask: (state, action) => {
            state.tasks.push(action.payload)
            // localStorage.setItem('tasks', JSON.stringify(state.tasks))
        },
        addProjectClient: (state, action) => {
            const {id, project, client} = action.payload
            state.projectClient[id] = {project, client, id}
            state.currentTask.project = project
            state.currentTask.client = client
        },
        setIsModalOpen: (state, action) => {
            state.isModalOpen = action.payload
        }, 
        updateTask: (state, action) => {
            const {id,...updateData} = action.payload
            const updatedTasks = state.tasks.map(task => task.id === id ? {...task, ...updateData} : task)
            return {...state, tasks: updatedTasks}
        },
        deleteTask: (state, action) => {
            const {id} = action.payload
            state.tasks = state.tasks.filter(task => task.id !== id)
            // localStorage.setItem('tasks', JSON.stringify(state.tasks))
        },
        updateUniqueId: (state) => {
            state.uniqueId = state.uniqueId + 1
            localStorage.setItem('uniqueId', JSON.stringify(state.uniqueId))
        },
        updateStartTime: (state, action) => {
            state.currentTask.startTime = (action.payload).toString()
        },
        updateEndTime: (state, action) => {
            state.currentTask.endTime = (action.payload).toString()
        }, 
        updateDuration: (state, action) => {
            state.currentTask.duration = action.payload
        },
        updateTaskName: (state, action) => {
            state.currentTask.taskName = action.payload
        },
        resetState: (state) => {
            state.currentTask.taskName = ''
            state.currentTask.startTime = new Date().toString()
            state.currentTask.endTime = new Date().toString()
            state.currentTask.duration = '00:00:00'
        },
        updateTimer: (state, action) => {
            const {name, project, client} = action.payload
            state.currentTask.taskName = name
            state.currentTask.project = project
            state.currentTask.client = client
        }
    }
})

export const {
    addTodayTask, 
    addProjectClient, 
    updateUniqueId, 
    updateTask, 
    deleteTask, 
    setIsModalOpen, 
    updateStartTime, 
    updateEndTime,
    updateDuration,
    updateTaskName,
    resetState,
    updateTimer
} = ClockifySlice.actions
export default ClockifySlice.reducer

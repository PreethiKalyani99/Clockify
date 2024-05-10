import { createSlice } from "@reduxjs/toolkit";

export const ClockifySlice = createSlice({
    name: 'clockify',
    initialState: {
        projectClient: {},
        tasks: [],
        uniqueId: JSON.parse(localStorage.getItem('uniqueId')) || 0,
        tasksByWeek: {},
        isModalOpen: false,
        startTime: new Date().toString(),
        endTime: new Date().toString(),
        duration: '00:00:00',
        taskName: ''
    },
    reducers: {
        addTodayTask: (state, action) => {
            state.tasks.push(action.payload)
            // localStorage.setItem('tasks', JSON.stringify(state.tasks))
        },
        addProjectClient: (state, action) => {
            const {id, ...props} = action.payload
            state.projectClient[id] = {...props, id}
        },
        setIsModalOpen: (state, action) => {
            state.isModalOpen = action.payload
        }, 
        updateTask: (state, action) => {
            const {id,...updatedTasks} = action.payload
            const index = state.tasks.findIndex(task => task.id === id)
            state.tasks = [
                ...state.tasks.slice(0, index),
                { ...state.tasks[index], ...updatedTasks },
                ...state.tasks.slice(index + 1)
            ]
            // localStorage.setItem('tasks', JSON.stringify(state.tasks))
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
            state.startTime = (action.payload).toString()
        },
        updateEndTime: (state, action) => {
            state.endTime = (action.payload).toString()
        }, 
        updateDuration: (state, action) => {
            state.duration = action.payload
        },
        updateTaskName: (state, action) => {
            state.taskName = action.payload
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
    updateTaskName
} = ClockifySlice.actions
export default ClockifySlice.reducer

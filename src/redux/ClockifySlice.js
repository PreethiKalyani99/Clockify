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
        },
        resetState: (state) => {
            state.taskName = ''
            state.startTime = new Date().toString()
            state.endTime = new Date().toString()
            state.duration = '00:00:00'
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
    resetState
} = ClockifySlice.actions
export default ClockifySlice.reducer

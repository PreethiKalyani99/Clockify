import { createSlice } from "@reduxjs/toolkit";

export const ClockifySlice = createSlice({
    name: 'clockify',
    initialState: {
        projectClient: {},
        tasks: {},
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
            const { date, id, ...task } = action.payload
            if (!state.tasks[date]) {
                state.tasks[date] = []
            }
            state.tasks[date].push({date, id, ...task})
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
            const {id, date, text, ...updatedTasks} = action.payload
            if(!state.tasks[date]){
                state.tasks[date] = []
                state.tasks[date].push({...updatedTasks,text, date, id})
            }
            else{
                const index = state.tasks[date].findIndex(task => task.id === id)
                if (index !== -1) {
                    state.tasks[date][index] = {
                        ...state.tasks[date][index],
                        text,
                        ...updatedTasks
                    }             
                }
            }
            // localStorage.setItem('tasks', JSON.stringify(state.tasks))
        },
        deleteTask: (state, action) => {
            const {id, date} = action.payload
            if(state.tasks[date]){
                state.tasks[date] = state.tasks[date].filter(task => task.id !== id)
            }
            if (state.tasks[date].length === 0) {
                delete state.tasks[date]
            }
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

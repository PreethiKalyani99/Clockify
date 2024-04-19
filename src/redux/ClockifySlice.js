import { createSlice } from "@reduxjs/toolkit";

export const ClockifySlice = createSlice({
    name: 'clockify',
    initialState: {
        projectClient: {},
        totalTasks: JSON.parse(localStorage.getItem('totalTasks')) || {},
        uniqueId: JSON.parse(localStorage.getItem('uniqueId')) || 0
    },
    reducers: {
        addTodayTask: (state, action) => {
            const { date, id, ...task } = action.payload
            if (!state.totalTasks[date]) {
                state.totalTasks[date] = []
            }
            state.totalTasks[date].push({...task, date, id})
            localStorage.setItem('totalTasks', JSON.stringify(state.totalTasks))
        },
        addProjectClient: (state, action) => {
            const {id, ...props} = action.payload
            state.projectClient[id] = props
        },
        updateTask: (state, action) => {
            const {id, date, text, ...updatedTasks} = action.payload
            if(!state.totalTasks[date]){
                state.totalTasks[date] = []
                state.totalTasks[date].push({...updatedTasks,text, date, id})
            }
            else{
                const index = state.totalTasks[date].findIndex(task => task.id === id)
                if (index !== -1) {
                    state.totalTasks[date][index] = {
                        ...state.totalTasks[date][index],
                        ...updatedTasks
                    }             
                }
            }
            localStorage.setItem('totalTasks', JSON.stringify(state.totalTasks))
        },
        deleteTask: (state, action) => {
            const {id, date} = action.payload
            console.log(id, date, 'action payload')
            console.log(state.totalTasks[date], state.totalTasks[date][id], 'jlkeioj')
            if(state.totalTasks[date]){
                state.totalTasks[date] = state.totalTasks[date].filter(task => task.id !== id)
                console.log(state.totalTasks[date], 'state')
            }
            if (state.totalTasks[date].length === 0) {
                delete state.totalTasks[date]
            }
            localStorage.setItem('totalTasks', JSON.stringify(state.totalTasks))
        },
        updateUniqueId: (state, action) => {
            state.uniqueId = state.uniqueId + 1
            localStorage.setItem('uniqueId', JSON.stringify(state.uniqueId))
        }
    }
})

export const {addTodayTask, addProjectClient, updateUniqueId, updateTask, deleteTask} = ClockifySlice.actions
export default ClockifySlice.reducer

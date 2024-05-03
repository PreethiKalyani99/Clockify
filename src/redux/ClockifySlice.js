import { createSlice } from "@reduxjs/toolkit";

export const ClockifySlice = createSlice({
    name: 'clockify',
    initialState: {
        projectClient: {},
        totalTasks: {},
        uniqueId: JSON.parse(localStorage.getItem('uniqueId')) || 0,
        tasksByWeek: {},
        isModalOpen: false
    },
    reducers: {
        addTodayTask: (state, action) => {
            const { date, id, ...task } = action.payload
            console.log(date, id, task, "add task============")
            if (!state.totalTasks[date]) {
                state.totalTasks[date] = []
            }
            state.totalTasks[date].push({date, id, ...task})
            // localStorage.setItem('totalTasks', JSON.stringify(state.totalTasks))
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
            console.log(id, 'id', date, "date", text, "text", updatedTasks, "updated taasks----------------")
            if(!state.totalTasks[date]){
                state.totalTasks[date] = []
                state.totalTasks[date].push({...updatedTasks,text, date, id})
            }
            else{
                const index = state.totalTasks[date].findIndex(task => task.id === id)
                if (index !== -1) {
                    state.totalTasks[date][index] = {
                        ...state.totalTasks[date][index],
                        text,
                        ...updatedTasks
                    }             
                }
            }
            // localStorage.setItem('totalTasks', JSON.stringify(state.totalTasks))
        },
        deleteTask: (state, action) => {
            const {id, date} = action.payload
            console.log(id, date, "delete id, date++++++++++++++++++++++++++++++")
            if(state.totalTasks[date]){
                state.totalTasks[date] = state.totalTasks[date].filter(task => task.id !== id)
            }
            if (state.totalTasks[date].length === 0) {
                delete state.totalTasks[date]
            }
            // localStorage.setItem('totalTasks', JSON.stringify(state.totalTasks))
        },
        updateUniqueId: (state) => {
            state.uniqueId = state.uniqueId + 1
            localStorage.setItem('uniqueId', JSON.stringify(state.uniqueId))
        }
    }
})

export const {addTodayTask, addProjectClient, updateUniqueId, updateTask, deleteTask, setIsModalOpen} = ClockifySlice.actions
export default ClockifySlice.reducer

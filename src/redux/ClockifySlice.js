import { createSlice } from "@reduxjs/toolkit";
import {
    getUserTimeEntries,
    createTimeEntry,
    updateTimeEntry,
    duplicateTimeEntry,
    deleteTimeEntry
} from "./clockifyThunk";

export const ClockifySlice = createSlice({
    name: 'clockify',
    initialState: {
        isLoading: false,
        data: [],
        projectClient: {},
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
        addProjectClient: (state, action) => {
            const {id, project, client} = action.payload
            state.projectClient[id] = {project, client, id}
            state.currentTask.project = project
            state.currentTask.client = client
        },
        setIsModalOpen: (state, action) => {
            state.isModalOpen = action.payload
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
    },
    extraReducers: (builder) => {
        builder.addCase(getUserTimeEntries.pending, (state) => {
            state.isLoading = true
        })
        builder.addCase(getUserTimeEntries.fulfilled, (state, action) => {
            state.isLoading = false
            state.data = action.payload
        })
        builder.addCase(createTimeEntry.pending, (state) => {
            state.isLoading = true
        })
        builder.addCase(createTimeEntry.fulfilled, (state, action) => {
            state.isLoading = false
            state.data = [action.payload, ...state.data]
        })
        builder.addCase(updateTimeEntry.pending, (state) => {
            state.isLoading = true
        })
        builder.addCase(updateTimeEntry.fulfilled, (state, action) => {
            state.isLoading = false
            const id = action.payload.id
            const timeEntry = state.data.find(entry => entry.id === id)
            if (timeEntry) {
                Object.assign(timeEntry, action.payload)
            }
        })
        builder.addCase(duplicateTimeEntry.pending, (state) => {
            state.isLoading = true
        })
        builder.addCase(duplicateTimeEntry.fulfilled, (state, action) => {
            state.isLoading = false
            state.data = [action.payload, ...state.data]
        })
        builder.addCase(deleteTimeEntry.pending, (state) => {
            state.isLoading = true
        })
        builder.addCase(deleteTimeEntry.fulfilled, (state, action) => {
            const id = action.payload
            const newData = state.data.filter(entry => entry.id !== id)
            state.data = newData
        })
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

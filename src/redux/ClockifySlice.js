import { createSlice } from "@reduxjs/toolkit";
import {
    getUserTimeEntries,
    createTimeEntry,
    updateTimeEntry,
    duplicateTimeEntry,
    deleteTimeEntry,
    getProjects,
    getClients,
    createProject,
    createClient,
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
        projects: [],
        clients: [],
        selectedProject: {value: '', label: 'Project'},
        selectedClient: {value: '', label: ''},
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
            state.selectedProject = {value: '', label: 'Project'}
            state.selectedClient = {value: '', label: ''}
        },
        updateTimer: (state, action) => {
            const {name, project, client, projectId, clientId} = action.payload
            state.currentTask.taskName = name
            state.selectedProject = {value: projectId, label: project}
            state.selectedClient = {value: clientId, label: client}
        },
        updateProjectValue: (state, action) => {
            state.selectedProject = action.payload
        },
        updateClientValue: (state, action) => {
            state.selectedClient = action.payload
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getUserTimeEntries.pending, (state) => {
            state.isLoading = true
        })
        .addCase(getUserTimeEntries.fulfilled, (state, action) => {
            state.isLoading = false
            state.data = action.payload
        })
        .addCase(createTimeEntry.pending, (state) => {
            state.isLoading = true
        })
        .addCase(createTimeEntry.fulfilled, (state, action) => {
            state.isLoading = false
            state.data = [...state.data, action.payload]
        })
        .addCase(updateTimeEntry.pending, (state) => {
            state.isLoading = true
        })
        .addCase(updateTimeEntry.fulfilled, (state, action) => {
            state.isLoading = false
            const id = action.payload.id
            const timeEntry = state.data.find(entry => entry.id === id)
            if (timeEntry) {
                Object.assign(timeEntry, action.payload)
            }
        })
        .addCase(duplicateTimeEntry.pending, (state) => {
            state.isLoading = true
        })
        .addCase(duplicateTimeEntry.fulfilled, (state, action) => {
            state.isLoading = false
            state.data = [action.payload, ...state.data]
        })
        .addCase(deleteTimeEntry.pending, (state) => {
            state.isLoading = true
        })
        .addCase(deleteTimeEntry.fulfilled, (state, action) => {
            const id = action.payload
            const newData = state.data.filter(entry => entry.id !== id)
            state.data = newData
        })
        .addCase(getProjects.fulfilled, (state, action) => {
            state.projects = action.payload
        })
        .addCase(getClients.fulfilled, (state, action) => {
            state.clients = action.payload
        })
        .addCase(createProject.fulfilled, (state, action) => {
            state.projects = [...state.projects, action.payload]
        })
        .addCase(createClient.fulfilled, (state, action) => {
            state.clients = [action.payload, ...state.clients]
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
    updateTimer,
    updateProjectValue,
    updateClientValue
} = ClockifySlice.actions
export default ClockifySlice.reducer

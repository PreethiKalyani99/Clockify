import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AUTH_TOKEN, WORKSPACE_ID, USER_ID } from "../config";

export const ClockifySlice = createSlice({
    name: 'clockify',
    initialState: {
        isLoading: false,
        data: [],
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
            state.data = [action.payload, ...state.data]
        })
        builder.addCase(duplicateTimeEntry.pending, (state) => {
            state.isLoading = true
        })
        builder.addCase(duplicateTimeEntry.fulfilled, (state, action) => {
            state.isLoading = false
            state.data = [action.payload, ...state.data]
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

export const getUserTimeEntries = createAsyncThunk("getUserTimeEntries", async () => {
    const response = await fetch(`https://api.clockify.me/api/v1/workspaces/${WORKSPACE_ID}/user/${USER_ID}/time-entries`, {
            method: "GET",
            headers: {
                'X-Api-Key':AUTH_TOKEN,
                'Content-Type': 'application/json'
            }
        },
    )
    if (!response.ok) {
        throw new Error('Failed to get time entries')
    }

    const data = await response.json();
    return data
})

export const createTimeEntry = createAsyncThunk("createTimeEntry", async (timeEntryData) => {
    const response = await fetch(`https://api.clockify.me/api/v1/workspaces/${WORKSPACE_ID}/time-entries`, {
        method: "POST",
        headers: {
            'X-Api-Key':AUTH_TOKEN,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(timeEntryData)
    })

    if (!response.ok) {
        throw new Error('Failed to create time entry')
    }

    const data = await response.json();
    return data
})

export const updateTimeEntry = createAsyncThunk("updateTimeEntry", async ({id, ...timeEntryData}) => {
    console.log(timeEntryData, id, "time entry data , id================")
    const response = await fetch(`https://api.clockify.me/api/v1/workspaces/${WORKSPACE_ID}/time-entries/${id}`, {
        method: "PUT",
        headers: {
            'X-Api-Key':AUTH_TOKEN,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(timeEntryData)
    })
    if (!response.ok) {
        throw new Error('Failed to update time entry')
    }

    const data = await response.json();
    return data
})

export const deleteTimeEntry = createAsyncThunk("deleteTimeEntry", async ({id}) => {
    await fetch(`https://api.clockify.me/api/v1/workspaces/${WORKSPACE_ID}/time-entries/${id}`, {
        method: "DELETE",
        headers: {
            'X-Api-Key':AUTH_TOKEN,
            'Content-Type': 'application/json'
        },
    })
})

export const duplicateTimeEntry = createAsyncThunk("duplicateTimeEntry", async ({id}) => {
    const response = await fetch(`https://api.clockify.me/api/v1/workspaces/${WORKSPACE_ID}/user/${USER_ID}/time-entries/${id}/duplicate`, {
        method: "POST",
        headers: {
            'X-Api-Key':AUTH_TOKEN,
            'Content-Type': 'application/json'
        }
    })
    if (!response.ok) {
        throw new Error('Failed to update time entry')
    }

    const data = await response.json();
    return data
})

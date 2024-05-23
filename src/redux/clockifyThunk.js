import { createAsyncThunk } from "@reduxjs/toolkit";
import { AUTH_TOKEN, USER_ID, WORKSPACE_ID } from "../config";

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

    return await response.json()
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

    return await response.json()
})

export const updateTimeEntry = createAsyncThunk("updateTimeEntry", async ({id, ...timeEntryData}) => {
    const response = await fetch(`https://api.clockify.me/api/v1/workspaces/${WORKSPACE_ID}/time-entries/${id}`, {
        method: "PUT",
        headers: {
            'X-Api-Key':AUTH_TOKEN,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(timeEntryData)
    })
    console.log('after await')
    if (!response.ok) {
        throw new Error('Failed to update time entry')
    }

    return await response.json()
})

export const deleteTimeEntry = createAsyncThunk("deleteTimeEntry", async ({id}) => {
    await fetch(`https://api.clockify.me/api/v1/workspaces/${WORKSPACE_ID}/time-entries/${id}`, {
        method: "DELETE",
        headers: {
            'X-Api-Key':AUTH_TOKEN,
            'Content-Type': 'application/json'
        }
    })
    return id
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

    return await response.json()
})

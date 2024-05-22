import { createAsyncThunk } from "@reduxjs/toolkit";
import { AUTH_TOKEN, WORKSPACE_ID, USER_ID } from "../config";

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
        }
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
import React, { useState, useEffect } from "react";
import { AddTask } from "./AddTask";
import { DisplayTasks } from "./DisplayTasks";
import { useSelector, useDispatch } from "react-redux";
import { updateDuration, updateEndTime, updateStartTime, addTodayTask, updateUniqueId, updateTaskName } from "../redux/ClockifySlice";
import { calculateTimeDifference } from "../utils/calculateTimeDifference";
import { calculateEndDate } from "../utils/calculateEndDate";
import { convertToHoursAndMinutes } from "../utils/convertToHoursAndMinutes";
import { calculateEndTime } from "../utils/calculateEndTime";
import { isDurationLimitExceeded } from "../utils/isDurationLimitExceeded";
import { getFormattedDate } from "../utils/getFormattedDate";

export function TimeTracker(props){
    const {projectClient , uniqueId, isModalOpen, startTime, endTime, duration, taskName} = useSelector(state => state.clockify)

    const [previousDuration, setPreviousDuration] = useState('00:00:00')

    const dispatch = useDispatch()

    const timeStart = new Date(startTime)
    const timeEnd = new Date(endTime)

    useEffect(() => {
        if(timeStart > timeEnd) {
            timeEnd.setDate(timeEnd.getDate() + 1)
            dispatch(updateEndTime(timeEnd.toString()))
        }
        const {hours, minutes} = calculateTimeDifference(timeStart, timeEnd)
        const timeParts = previousDuration.split(':')
        const totalTimeDuration = `${hours.toString().padStart(2,'0')}:${minutes.toString().padStart(2,'0')}:${timeParts[2]}`
        const timeDuration = (hours <= 999) ? totalTimeDuration : previousDuration
        if (timeDuration !== previousDuration) {
            dispatch(updateDuration(timeDuration))
        }
    }, [startTime, endTime])

    const handleDateChange = (dateTime) => {
        dispatch(updateStartTime(dateTime.toString()))
        const newEndTime = calculateEndDate(dateTime, timeEnd, timeStart)
        dispatch(updateEndTime(newEndTime.toString()))
    }

    const handleStartTimeBlur = (e) => {
        const {isValid, validatedHour, validatedMins} = convertToHoursAndMinutes(e.target.value)
        console.log("start time blur")
        if(isValid){
            const start = new Date(timeStart)
            start.setHours(validatedHour, validatedMins)
            const isLimitExceeded = isDurationLimitExceeded(start, timeEnd)
            if(!isLimitExceeded){
                // startTimeRef.current.value = `${validatedHour}:${validatedMins}`
                timeStart.setHours(validatedHour, validatedMins)
                dispatch(updateStartTime(timeStart.toString()))
            }
            else{
                // startTimeRef.current.value = `${timeStart.getHours().toString().padStart(2,'0')}:${timeStart.getMinutes().toString().padStart(2,'0')}`
            }
        }
        else{
            // startTimeRef.current.value = `${timeStart.getHours().toString().padStart(2,'0')}:${timeStart.getMinutes().toString().padStart(2,'0')}`
        }
    }

    const handleEndTimeBlur = (e) => {
        const {isValid, validatedHour, validatedMins} = convertToHoursAndMinutes(e.target.value)
        console.log("end time blur")
        if(isValid){
            const end = new Date(timeEnd)
            end.setHours(validatedHour, validatedMins)
            const isLimitExceeded = isDurationLimitExceeded(timeStart, end)
            if(!isLimitExceeded){
                // endTimeRef.current.value = `${validatedHour}:${validatedMins}`
                timeEnd.setHours(validatedHour, validatedMins)
                dispatch(updateEndTime(timeEnd.toString()))
            }
            else{
                // endTimeRef.current.value = `${timeEnd.getHours().toString().padStart(2,'0')}:${timeEnd.getMinutes().toString().padStart(2,'0')}`
            }
        }
        else{
            // endTimeRef.current.value = `${timeEnd.getHours().toString().padStart(2,'0')}:${timeEnd.getMinutes().toString().padStart(2,'0')}`
        }

    }
    const handleTaskNameChange = (e) => {
        dispatch(updateTaskName(e.target.value));
    }

    const handleTotalDurationBlur = (e) => {
        const {isValid, newEndTime, timeDuration} = calculateEndTime(timeStart, e.target.value)
        console.log("duration blur")
        if(isValid){
            // endTimeRef.current.value = `${(newEndTime.getHours()).toString().padStart(2,'0')}:${(newEndTime.getMinutes()).toString().padStart(2,'0')}`
            dispatch(updateEndTime(newEndTime.toString()))
            dispatch(updateDuration(timeDuration))
            setPreviousDuration(timeDuration)
            // totalDurationRef.current.value = timeDuration
        }
        else{
            dispatch(updateDuration(previousDuration))
            // totalDurationRef.current.value = previousDuration
        }
    }

    const addTask = () => {
        // if(taskName !== ''){
                dispatch(addTodayTask({
                date: getFormattedDate(timeStart),
                id: uniqueId,
                text: taskName,
                totalTime: duration,
                project: projectClient?.[uniqueId]?.project,
                client: projectClient?.[uniqueId]?.client,
                startTime: new Date(timeStart).toString(),
                endTime:  new Date(timeEnd).toString()
            }))
            dispatch(updateUniqueId())
            dispatch(updateTaskName(''))
            dispatch(updateStartTime(new Date().toString()))
            dispatch(updateEndTime(new Date().toString()))
            dispatch(updateDuration('00:00:00'))
            // startTimeRef.current.value = `${(new Date().getHours()).toString().padStart(2,'0')}:${(new Date().getMinutes()).toString().padStart(2,'0')}`
            // endTimeRef.current.value = `${(new Date().getHours()).toString().padStart(2,'0')}:${(new Date().getMinutes()).toString().padStart(2,'0')}`
        // }
        // else{
            // alert('Please enter task description')
        // }
    }

    return (
        <>
            <AddTask
                isSidebarShrunk={props.isSidebarShrunk}
                projectClient={projectClient}
                uniqueId={uniqueId}
                taskName={taskName}
                timeStart={new Date(startTime)}
                timeEnd={new Date(endTime)}
                duration={duration}
                isModalOpen={isModalOpen}
                onNameChange={handleTaskNameChange}
                onStartBlur={handleStartTimeBlur}
                onEndBlur={handleEndTimeBlur}
                onDurationBlur={handleTotalDurationBlur}
                onDateChange={handleDateChange}
                onAddTask={addTask}
            />
            <DisplayTasks
                isSidebarShrunk = {props.isSidebarShrunk}
            />
        </>
    )
}

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
import { getFormattedTime } from "../utils/getFormattedTime";

export function TimeTracker(props){
    const {projectClient , uniqueId, isModalOpen, startTime, endTime, duration, taskName} = useSelector(state => state.clockify)

    const timeStart = new Date(startTime)
    const timeEnd = new Date(endTime)

    const [startDateTime, setStartDateTime] = useState(getFormattedTime(timeStart));
    const [endDateTime, setEndDateTime] = useState(getFormattedTime(timeEnd));
    const [totalDuration, setDuration] = useState(duration);
    const [taskDescription, setTaskDescription] = useState(taskName);

    const [previousDuration, setPreviousDuration] = useState('00:00:00')

    const dispatch = useDispatch()

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
            setDuration(timeDuration)
        }
    }, [startTime, endTime])

    const handleDateChange = (dateTime) => {
        dispatch(updateStartTime(dateTime.toString()))
        const newEndTime = calculateEndDate(dateTime, timeEnd, timeStart)
        dispatch(updateEndTime(newEndTime.toString()))
    }

    const handleStartTimeBlur = (e) => {
        const {isValid, validatedHour, validatedMins} = convertToHoursAndMinutes(e.target.value)
        if(isValid){
            const start = new Date(timeStart)
            start.setHours(validatedHour, validatedMins)
            const isLimitExceeded = isDurationLimitExceeded(start, timeEnd)
            if(!isLimitExceeded){
                timeStart.setHours(validatedHour, validatedMins)
                dispatch(updateStartTime(timeStart.toString()))
                setStartDateTime(`${validatedHour}:${validatedMins}`)
            }
            else{
                setStartDateTime(`${timeStart.getHours().toString().padStart(2,'0')}:${timeStart.getMinutes().toString().padStart(2,'0')}`)
            }
        }
        else{
            setStartDateTime(`${timeStart.getHours().toString().padStart(2,'0')}:${timeStart.getMinutes().toString().padStart(2,'0')}`)
        }
    }

    const handleEndTimeBlur = (e) => {
        const {isValid, validatedHour, validatedMins} = convertToHoursAndMinutes(e.target.value)
        if(isValid){
            const end = new Date(timeEnd)
            end.setHours(validatedHour, validatedMins)
            const isLimitExceeded = isDurationLimitExceeded(timeStart, end)
            if(!isLimitExceeded){
                timeEnd.setHours(validatedHour, validatedMins)
                dispatch(updateEndTime(timeEnd.toString()))
                setEndDateTime(`${validatedHour}:${validatedMins}`)
            }
            else{
                setEndDateTime(`${timeEnd.getHours().toString().padStart(2,'0')}:${timeEnd.getMinutes().toString().padStart(2,'0')}`)
            }
        }
        else{
            setEndDateTime(`${timeEnd.getHours().toString().padStart(2,'0')}:${timeEnd.getMinutes().toString().padStart(2,'0')}`)
        }

    }
    const handleTaskNameBlur = (e) => {
        dispatch(updateTaskName(e.target.value));
    }

    const handleTotalDurationBlur = (e) => {
        const {isValid, newEndTime, timeDuration} = calculateEndTime(timeStart, e.target.value)
        if(isValid){
            dispatch(updateEndTime(newEndTime.toString()))
            dispatch(updateDuration(timeDuration))
            setPreviousDuration(timeDuration)
            setEndDateTime(`${newEndTime.getHours().toString().padStart(2,'0')}:${newEndTime.getMinutes().toString().padStart(2,'0')}`)
            setDuration(timeDuration)
        }
        else{
            dispatch(updateDuration(previousDuration))
            setDuration(previousDuration)
        }
    }

    const addTask = () => {
        if(taskName !== ''){
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
            setStartDateTime(`${(new Date().getHours()).toString().padStart(2,'0')}:${(new Date().getMinutes()).toString().padStart(2,'0')}`)
            setEndDateTime(`${(new Date().getHours()).toString().padStart(2,'0')}:${(new Date().getMinutes()).toString().padStart(2,'0')}`)
            setDuration('00:00:00')
            setTaskDescription('')
        }
        else{
            alert('Please enter task description')
        }
    }

    return (
        <>
            <AddTask
                isSidebarShrunk={props.isSidebarShrunk}
                projectClient={projectClient}
                uniqueId={uniqueId}
                timeStart={new Date(startTime)}
                timeEnd={new Date(endTime)}
                isModalOpen={isModalOpen}
                taskDescription={taskDescription}
                start={startDateTime}
                end={endDateTime}
                totalDuration={totalDuration}
                onNameChange={(e) =>  setTaskDescription(e.target.value)}
                onStartChange={(e) =>  setStartDateTime(e.target.value)}
                onEndChange={(e) =>  setEndDateTime(e.target.value)}
                onDurationChange={(e) =>  setDuration(e.target.value)}
                onTaskBlur={handleTaskNameBlur}
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

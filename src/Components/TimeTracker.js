import React, { useState, useEffect, useRef } from "react";
import { AddTask } from "./AddTask";
import { Tasks } from "./Tasks";
import { useSelector, useDispatch } from "react-redux";
import {
    updateDuration,
    updateEndTime,
    updateStartTime,
    addTodayTask,
    updateUniqueId,
    updateTaskName,
} from "../redux/ClockifySlice";
import { calculateTimeDifference } from "../utils/calculateTimeDifference";
import { calculateEndDate } from "../utils/calculateEndDate";
import { convertToHoursAndMinutes } from "../utils/convertToHoursAndMinutes";
import { calculateEndTime } from "../utils/calculateEndTime";
import { isDurationLimitExceeded } from "../utils/isDurationLimitExceeded";
import { getFormattedDate } from "../utils/getFormattedDate";
import { getFormattedTime } from "../utils/getFormattedTime";

export function TimeTracker(props){
    const {projectClient , uniqueId, isModalOpen, startTime, endTime, duration, taskName, tasks} = useSelector(state => state.clockify)

    const timeStart = new Date(startTime)
    const timeEnd = new Date(endTime)

    const [startDateTime, setStartDateTime] = useState(getFormattedTime(timeStart))
    const [endDateTime, setEndDateTime] = useState(getFormattedTime(timeEnd))
    const [totalDuration, setDuration] = useState(duration);

    const [showActionItems, setShowActionItems] = useState(false)

    const dispatch = useDispatch()

    function updateEndDateIfNeeded() {
        if (timeStart > timeEnd) {
            let date = new Date(timeEnd)
            date.setDate(date.getDate() + 1)
            dispatch(updateEndTime(date.toString()))
        }
    }

    function updateDurationIfNeeded() {
        const {hours, minutes} = calculateTimeDifference(timeStart, timeEnd)
        const timeParts = duration.split(':')
        const totalTimeDuration = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${timeParts[2]}`
        const timeDuration = (hours <= 999) ? totalTimeDuration : duration
        if (timeDuration !== duration) {
            dispatch(updateDuration(timeDuration))
            setDuration(timeDuration)
        }
    }

    useEffect(() => {
        updateEndDateIfNeeded()
        updateDurationIfNeeded()

    }, [startTime, endTime])

    const handleDateChange = (dateTime) => {
        dispatch(updateStartTime(dateTime.toString()))
        const newEndTime = calculateEndDate(dateTime, timeEnd, timeStart)
        dispatch(updateEndTime(newEndTime.toString()))
    }

    const handleStartTimeBlur = (e) => {
        const {isValid, validatedHour, validatedMins} = convertToHoursAndMinutes(e.target.value)
        const newStart = new Date(timeStart)
        newStart.setHours(validatedHour, validatedMins)

        if (!isValid || isDurationLimitExceeded(newStart, timeEnd)) {
            setStartDateTime(getFormattedTime(timeStart))
            return
        }

        dispatch(updateStartTime(newStart.toString()))
        setStartDateTime(getFormattedTime(newStart))
    }

    const handleEndTimeBlur = (e) => {
        const {isValid, validatedHour, validatedMins} = convertToHoursAndMinutes(e.target.value)
        const newEnd = new Date(timeEnd)
        newEnd.setHours(validatedHour, validatedMins)

        if(!isValid || isDurationLimitExceeded(timeStart, newEnd)) {
            setEndDateTime(getFormattedTime(timeEnd))
            return
        }

        dispatch(updateEndTime(newEnd.toString()))
        setEndDateTime(getFormattedTime(newEnd))
    }

    const handleTotalDurationBlur = (e) => {
        const {isValid, newEndTime, timeDuration} = calculateEndTime(timeStart, e.target.value)
        if(isValid){
            dispatch(updateEndTime(newEndTime.toString()))
            dispatch(updateDuration(timeDuration))
            setEndDateTime(getFormattedTime(newEndTime))
            setDuration(timeDuration)
        }
        else{
            setDuration(duration)
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
            // dispatch(updateDuration('00:00:00'))
            setStartDateTime(`${(new Date().getHours()).toString().padStart(2,'0')}:${(new Date().getMinutes()).toString().padStart(2,'0')}`)
            setEndDateTime(`${(new Date().getHours()).toString().padStart(2,'0')}:${(new Date().getMinutes()).toString().padStart(2,'0')}`)
            setDuration('00:00:00')
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
                taskDescription={taskName}
                start={startDateTime}
                end={endDateTime}
                totalDuration={totalDuration}
                onNameChange={(e) =>  dispatch(updateTaskName(e.target.value))}
                onStartChange={(e) =>  setStartDateTime(e.target.value)}
                onEndChange={(e) =>  setEndDateTime(e.target.value)}
                onDurationChange={(e) =>  setDuration(e.target.value)}
                onStartBlur={handleStartTimeBlur}
                onEndBlur={handleEndTimeBlur}
                onDurationBlur={handleTotalDurationBlur}
                onDateChange={handleDateChange}
                onAddTask={addTask}
            />
            <Tasks
                isSidebarShrunk={props.isSidebarShrunk}
                tasks={tasks}
                timeStart={new Date(startTime)}
                timeEnd={new Date(endTime)}
                projectClient={projectClient}
                uniqueId={uniqueId}
                duration={duration}
                taskName={taskName}
                onStartBlur={handleStartTimeBlur}
                onEndBlur={handleEndTimeBlur}
                onDurationBlur={handleTotalDurationBlur}
                onDateChange={handleDateChange}
                toggleAction={() => setShowActionItems(!showActionItems)}
                showActionItems={showActionItems}
                convertToHoursAndMinutes={convertToHoursAndMinutes}
                isDurationLimitExceeded={isDurationLimitExceeded}
                calculateEndTime={calculateEndTime}
                calculateEndDate={calculateEndDate}
                getFormattedTime={getFormattedTime}
                addTodayTask={addTodayTask}
                dispatch={dispatch}
            />
        </>
    )
}

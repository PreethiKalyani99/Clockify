import React, { useState, useEffect, useRef } from "react";
import { AddTask } from "./AddTask";
import { DisplayTasks } from "./DisplayTasks";
import { useSelector, useDispatch } from "react-redux";
import { 
    updateDuration, 
    updateEndTime, 
    updateStartTime, 
    addTodayTask, 
    updateUniqueId, 
    updateTaskName,
    updateTask,
    deleteTask
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

    const [startDateTime, setStartDateTime] = useState(getFormattedTime(timeStart));
    const [endDateTime, setEndDateTime] = useState(getFormattedTime(timeEnd));
    const [totalDuration, setDuration] = useState(duration);
    const [taskDescription, setTaskDescription] = useState(taskName);

    const [previousDuration, setPreviousDuration] = useState('00:00:00')
    const [showActionItems, setShowActionItems] = useState(false)

    const [displayStartDateTime, setDisplayStartDateTime] = useState({ ...tasks })
    const [displayEndDateTime, setDisplayEndDateTime] = useState(tasks)
    const [displayTotalDuration, setDisplayDuration] = useState(tasks)
    const [displayTaskDescription, setDisplayTaskDescription] = useState(tasks)
    const [displayPreviousDuration, setDisplayPreviousDuration] = useState(tasks)

    console.log(tasks, "total tasks")
    console.log(displayStartDateTime, "display start date time")
    const dispatch = useDispatch()

    let updateStartRef = useRef('')
    let updateEndRef = useRef('')
    let updateDurationRef = useRef('')

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
            // const {id, date, text, startTime, endTime, project, client, totalTime} = updateEndRef.current
            // dispatch(updateTask({id, date, text, startTime, endTime, project, client, totalTime}))
            // if(updateStartRef.current !== ''){
            //     const {id, date, text, startTime, endTime, project, client, totalTime} = updateStartRef.current
            //     dispatch(updateTask({id, date, text, startTime, endTime, project, client, totalTime}))
            //     updateStartRef.current = ''
            //     updateDurationRef.current = timeDuration
            // }
            // if(updateEndRef.current !== ''){
            //     const {id, date, text, startTime, endTime, project, client, totalTime} = updateEndRef.current
            //     dispatch(updateTask({id, date, text, startTime, endTime, project, client, totalTime}))
            //     updateEndRef.current = ''
            //     updateDurationRef.current = timeDuration
            // }
        }
    }, [startTime, endTime])

    const handleDateChange = (dateTime, timeStartProp = new Date(timeStart), timeEndProp = new Date(timeEnd),updateProps = '') => {
        dispatch(updateStartTime(dateTime.toString()))
        const newEndTime = calculateEndDate(dateTime, timeEndProp, timeStartProp)
        dispatch(updateEndTime(newEndTime.toString()))
        // if(updateProps !== ''){
        //     const {id, date, text, startTime, endTime, project, client, totalTime} = updateProps
        //     dispatch(updateTask({id, date, text, startTime, endTime, project, client, totalTime}))
        //     dispatch(deleteTask({id, date}))
        // }
        
    }

    const handleStartTimeBlur = (e, timeStartProp = timeStart, updateProps = '') => {
        updateStartRef.current = updateProps
        updateDurationRef.current = updateProps
        const {isValid, validatedHour, validatedMins} = convertToHoursAndMinutes(e.target.value)
        const start = new Date(timeStartProp)
        if(isValid){
            start.setHours(validatedHour, validatedMins)
            const isLimitExceeded = isDurationLimitExceeded(start, timeEnd)
            if(!isLimitExceeded){
                timeStartProp.setHours(validatedHour, validatedMins)
                dispatch(updateStartTime(timeStartProp.toString()))
                setStartDateTime(`${validatedHour}:${validatedMins}`)
        }
            else{
                setStartDateTime(`${timeStartProp.getHours().toString().padStart(2,'0')}:${timeStartProp.getMinutes().toString().padStart(2,'0')}`)
            }
        }
        else{
            setStartDateTime(`${timeStartProp.getHours().toString().padStart(2,'0')}:${timeStartProp.getMinutes().toString().padStart(2,'0')}`)
        }
    }

    const handleEndTimeBlur = (e, timeEndProp = timeEnd, updateProps = '') => {
        updateEndRef = updateProps
        updateDurationRef.current = updateProps
        const {isValid, validatedHour, validatedMins} = convertToHoursAndMinutes(e.target.value)
        const end = new Date(timeEndProp)
        if(isValid){
            end.setHours(validatedHour, validatedMins)
            const isLimitExceeded = isDurationLimitExceeded(timeStart, end)
            if(!isLimitExceeded){
                timeEndProp.setHours(validatedHour, validatedMins)
                dispatch(updateEndTime(timeEndProp.toString()))
                setEndDateTime(`${validatedHour}:${validatedMins}`)
            }
            else{
                setEndDateTime(`${timeEndProp.getHours().toString().padStart(2,'0')}:${timeEndProp.getMinutes().toString().padStart(2,'0')}`)
            }
        }
        else{
            setEndDateTime(`${timeEndProp.getHours().toString().padStart(2,'0')}:${timeEndProp.getMinutes().toString().padStart(2,'0')}`)
        }
    }
    const handleTaskNameBlur = (e, updateProps = '') => {
        dispatch(updateTaskName(e.target.value));

        // const {id, date, text, startTime, endTime, project, client, totalTime} = updateProps
        // dispatch(updateTask({id, date, text, startTime, endTime, project, client, totalTime}))
    }

    const handleTotalDurationBlur = (e, timeStartProp = timeStart, updateProps = '') => {
        const {isValid, newEndTime, timeDuration} = calculateEndTime(timeStartProp, e.target.value)
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

        // const {id, date, text, startTime, endTime, project, client, totalTime} = updateProps
        // dispatch(updateTask({id, date, text, startTime, endTime, project, client, totalTime}))
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
                isSidebarShrunk={props.isSidebarShrunk}
                tasks={tasks}
                timeStart={new Date(startTime)}
                timeEnd={new Date(endTime)}
                projectClient={projectClient}
                uniqueId={uniqueId}
                duration={duration}
                taskName={taskName}
                onTaskBlur={handleTaskNameBlur}
                onStartBlur={handleStartTimeBlur}
                onEndBlur={handleEndTimeBlur}
                onDurationBlur={handleTotalDurationBlur}
                onDateChange={handleDateChange}
                toggleAction={() => setShowActionItems(!showActionItems)}
                showActionItems={showActionItems}
            />
        </>
    )
}

import React, { useState, useRef, useEffect } from "react";
import { addTodayTask, updateUniqueId, updateStartTime, updateEndTime, updateDuration } from "../redux/ClockifySlice";
import { useDispatch, useSelector } from 'react-redux';
import { AddProject } from "./AddProject";
import DatePicker from "react-datepicker";
import { validateTime } from "../utils/validateTime";
import "react-datepicker/dist/react-datepicker.css";
import { calculateTimeDifference } from "../utils/calculateTimeDifference";
import { getFormattedTime } from "../utils/getFormattedTime";
import { getFormattedDate } from "../utils/getFormattedDate";
import { calculateEndDate } from "../utils/calculateEndDate";
import { calculateEndTime } from "../utils/calculateEndTime";
import { calculateDays } from "../utils/calculateDays";
import { isDurationLimitExceeded } from "../utils/isDurationLimitExceeded";

export function AddTask(props){
    const {projectClient , uniqueId, isModalOpen, startTime, endTime, duration} = useSelector(state => state.clockify)

    const [taskName, setTaskName] = useState('')
    const [previousDuration, setPreviousDuration] = useState('00:00:00')

    const startTimeRef = useRef()
    const endTimeRef = useRef()
    const totalDurationRef = useRef()

    const dispatch = useDispatch()

    let timeStart = new Date(startTime)
    let timeEnd = new Date(endTime)
    useEffect(() => {
        if(timeStart > timeEnd) {
            timeEnd.setDate(timeEnd.getDate() + 1)
            dispatch(updateEndTime(timeEnd.toString()))
        }
        const {hours, minutes} = calculateTimeDifference(timeStart, timeEnd)
        const timeParts = previousDuration.split(':')
        const totalTimeDuration = `${hours.toString().padStart(2,'0')}:${minutes.toString().padStart(2,'0')}:${timeParts[2]}`
        const duration = (hours <= 999) ? totalTimeDuration : previousDuration
        dispatch(updateDuration(duration))
        totalDurationRef.current.value = duration
    }, [timeStart, timeEnd])
    
    const handleKey = (e) => {
        if(e.key === 'Enter'){
            addTask()
        }
    }

    const handleInputChange = (e) => {
        setTaskName(e.target.value)
    }

    const handleDateChange = (dateTime) => {
        dispatch(updateStartTime(dateTime.toString()))
        const newEndTime = calculateEndDate(dateTime, timeEnd, timeStart)
        dispatch(updateEndTime(newEndTime.toString()))
    }

    const handleStartTimeBlur = () => {
        const {isValid, validatedHour, validatedMins} = validateTime(startTimeRef.current.value)
        if(isValid){
            const start = new Date(timeStart)
            start.setHours(validatedHour, validatedMins)
            const isLimitExceeded = isDurationLimitExceeded(start, timeEnd)
            if(!isLimitExceeded){
                startTimeRef.current.value = `${validatedHour}:${validatedMins}`
                timeStart.setHours(validatedHour, validatedMins)
                dispatch(updateStartTime(timeStart.toString()))
            }
            else{
                startTimeRef.current.value = `${timeStart.getHours().toString().padStart(2,'0')}:${timeStart.getMinutes().toString().padStart(2,'0')}`
            }
        }
        else{
            startTimeRef.current.value = `${timeStart.getHours().toString().padStart(2,'0')}:${timeStart.getMinutes().toString().padStart(2,'0')}`
        }
    }

    const handleEndTimeBlur = () => {
        const {isValid, validatedHour, validatedMins} = validateTime(endTimeRef.current.value)
        if(isValid){
            const end = new Date(timeEnd)
            end.setHours(validatedHour, validatedMins)
            const isLimitExceeded = isDurationLimitExceeded(timeStart, end)
            if(!isLimitExceeded){
                endTimeRef.current.value = `${validatedHour}:${validatedMins}`
                timeEnd.setHours(validatedHour, validatedMins)
                dispatch(updateEndTime(timeEnd.toString()))
            }
            else{
                endTimeRef.current.value = `${timeEnd.getHours().toString().padStart(2,'0')}:${timeEnd.getMinutes().toString().padStart(2,'0')}`
            }
        }
        else{
            endTimeRef.current.value = `${timeEnd.getHours().toString().padStart(2,'0')}:${timeEnd.getMinutes().toString().padStart(2,'0')}`
        }

    }

    const handleTotalDurationBlur = (e) => {
        const {isValid, newEndTime, timeDuration} = calculateEndTime(timeStart, e.target.value)
        if(isValid){
            endTimeRef.current.value = `${(newEndTime.getHours()).toString().padStart(2,'0')}:${(newEndTime.getMinutes()).toString().padStart(2,'0')}`
            dispatch(updateEndTime(newEndTime.toString()))
            dispatch(updateDuration(timeDuration))
            setPreviousDuration(timeDuration)
            totalDurationRef.current.value = timeDuration
        }
        else{
            dispatch(updateDuration(previousDuration))
            totalDurationRef.current.value = previousDuration
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
            setTaskName('')
            dispatch(updateStartTime(new Date().toString()))
            dispatch(updateEndTime(new Date().toString()))
            dispatch(updateDuration('00:00:00'))
            startTimeRef.current.value = `${(new Date().getHours()).toString().padStart(2,'0')}:${(new Date().getMinutes()).toString().padStart(2,'0')}`
            endTimeRef.current.value = `${(new Date().getHours()).toString().padStart(2,'0')}:${(new Date().getMinutes()).toString().padStart(2,'0')}`
        }
        else{
            alert('Please enter task description')
        }
    }

    const days = calculateDays(timeStart, timeEnd)
    return(
        <>
            <div className={isModalOpen ? "add-task-container" : "add-task-container zIndex"} data-testid="container">
                <input
                    data-testid="task-name"
                    type="text"
                    placeholder="What are you working on?"
                    className={props.isSidebarShrunk ?  "input-box expand-input-width" : "input-box shrink-input-width"}
                    onKeyDown={handleKey}
                    value={taskName} 
                    onChange={handleInputChange}
                ></input>
                <AddProject
                    projectClient={projectClient}
                    id={uniqueId}
                    project=''
                    client=''
                />
                
                <input
                    data-testid="start-time"
                    type="text"
                    name="startTime"
                    ref={startTimeRef}
                    onBlur={handleStartTimeBlur}
                    defaultValue={getFormattedTime(timeStart)}
                ></input>
                <input
                    data-testid="end-time"
                    type="text"
                    name="endTime"
                    ref={endTimeRef}
                    onBlur={handleEndTimeBlur}
                    defaultValue={getFormattedTime(timeEnd)}
                ></input>
                {days > 0 && <sup className="fs-6"><b>{'+' + days}</b></sup>}
                
                <input
                    data-testid="task-duration"
                    type='text'
                    className='duration'
                    ref={totalDurationRef}
                    onBlur={handleTotalDurationBlur}
                    defaultValue='00:00:00'
                />
                <DatePicker
                    id="date-picker"
                    selected={timeStart}
                    onChange={handleDateChange}
                    showTimeSelect={false}
                    dateFormat="yyyy-MM-dd"
                    customInput={
                        <button>
                            <i className="bi bi-calendar"></i>
                        </button>
                    }
                />
                <p
                    className="ms-2"
                >{getFormattedDate(timeStart)}</p>
                <button onClick={addTask} data-testid="add-task">
                    Add
                </button>
        
            </div>
        </>
    )
}

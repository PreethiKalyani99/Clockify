import React, { useState, useRef, useEffect } from "react";
import { addTodayTask, updateUniqueId, updateStartTime, updateEndTime } from "../redux/ClockifySlice";
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

export function AddTask(props){
    const {projectClient , uniqueId, isModalOpen, startTime, endTime} = useSelector(state => state.clockify)

    const [taskName, setTaskName] = useState('')
    const [totalDuration, setTotalDuration] = useState('00:00:00')
    const [previousDuration, setPreviousDuration] = useState('00:00:00')

    const startTimeRef = useRef()
    const endTimeRef = useRef()

    const dispatch = useDispatch()

    let timeStart = new Date(startTime)
    let timeEnd = new Date(endTime)


    useEffect(() => {
        if(timeStart.getHours() > timeEnd.getHours() && (timeStart.getDate() - timeEnd.getDate() === 0)){
            timeEnd.setDate(timeEnd.getDate() + 1)
            dispatch(updateEndTime(timeEnd.toString()))
        }
        const {hours, minutes} = calculateTimeDifference(timeStart, timeEnd)
        setTotalDuration(`${hours}:${minutes}:00`)
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
        const {isValid, validatedHour, validatedMins} = validateTime(startTimeRef.current.value, getFormattedDate(timeStart))
        if(isValid){
            startTimeRef.current.value = `${validatedHour.toString().padStart(2,'0')}:${validatedMins.toString().padStart(2,'0')}`
            timeStart.setHours(validatedHour, validatedMins)
            dispatch(updateStartTime(timeStart.toString()))
        }
        else{
            startTimeRef.current.value = `${timeStart.getHours().toString().padStart(2,'0')}:${timeStart.getMinutes().toString().padStart(2,'0')}`
        }
    }

    const handleEndTimeBlur = () => {
        const {isValid, validatedHour, validatedMins} = validateTime(endTimeRef.current.value, getFormattedDate(timeEnd))
        if(isValid){
            endTimeRef.current.value = `${validatedHour.toString().padStart(2,'0')}:${validatedMins.toString().padStart(2,'0')}`
            timeEnd.setHours(validatedHour, validatedMins)
            dispatch(updateEndTime(timeEnd.toString()))
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
            setTotalDuration(timeDuration)
            setPreviousDuration(timeDuration)
        }
        else{
            setTotalDuration(previousDuration)
        }
    }

    const addTask = () => {
        if(taskName !== ''){
            dispatch(addTodayTask({
                date: getFormattedDate(timeStart),
                id: uniqueId,
                text: taskName,
                totalTime: totalDuration,
                project: projectClient?.[uniqueId]?.project,
                client: projectClient?.[uniqueId]?.client,
                startTime: new Date(timeStart),
                endTime:  new Date(timeEnd)
            }))
            dispatch(updateUniqueId())
            setTaskName('')
            dispatch(updateStartTime(new Date().toString()))
            dispatch(updateEndTime(new Date().toString()))
            setTotalDuration('00:00:00')
            startTimeRef.current.value = `${(new Date().getHours()).toString().padStart(2,'0')}:${(new Date().getMinutes()).toString().padStart(2,'0')}`
            endTimeRef.current.value = `${(new Date().getHours()).toString().padStart(2,'0')}:${(new Date().getMinutes()).toString().padStart(2,'0')}`
        }
        else{
            alert('Please enter task description')
        }
    }

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
                <button onClick={addTask} data-testid="add-task">
                    Add
                </button>
                <input
                    data-testid="start-time"
                    type="text"
                    name="startTime"
                    ref={startTimeRef}
                    onBlur={handleStartTimeBlur}
                    defaultValue={getFormattedTime(timeStart)}
                ></input>
                <p>{timeStart.toString()}</p>
                <input
                    data-testid="end-time"
                    type="text"
                    name="endTime"
                    ref={endTimeRef}
                    onBlur={handleEndTimeBlur}
                    defaultValue={getFormattedTime(timeEnd)}
                ></input>
                <p>{timeEnd.toString()}</p>
                <input
                    data-testid="task-duration"
                    type='text'
                    className='duration'
                    value={totalDuration}
                    onChange={(e) => setTotalDuration(e.target.value)}
                    onBlur={handleTotalDurationBlur}
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
            </div>
        </>
    )
}

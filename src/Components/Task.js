import React, {useState, useEffect, useRef} from "react";
import { useDispatch } from "react-redux";
import DatePicker from "react-datepicker";
import { AddProject } from "./AddProject";
import { getFormattedDate } from "../utils/getFormattedDate";
import { getFormattedTime } from "../utils/getFormattedTime";
import "react-datepicker/dist/react-datepicker.css";
import { updateTask } from "../redux/ClockifySlice";
import { calculateTimeDifference } from "../utils/calculateTimeDifference";
import useClickOutside from "../utils/useClickOutside";

export function Task({task, onTaskBlur, onStartBlur, onEndBlur, onDurationBlur, onDateChange, onDelete, onDuplicate, projectClient}){
    const dispatch = useDispatch()
    const timeStart = new Date(task.startTime)
    const timeEnd = new Date(task.endTime)
    const [startDateTime, setStartDateTime] = useState(getFormattedTime(timeStart))
    const [endDateTime, setEndDateTime] = useState(getFormattedTime(timeEnd))
    const [totalDuration, setDuration] = useState(task.totalTime)
    const [taskDescription, setTaskDescription] = useState(task.text)
    const [showActionItems, setShowActionItems] = useState(false)

    function updateEndDateIfNeeded() {
        if (timeStart > timeEnd) {
            let date = new Date(timeEnd)
            date.setDate(date.getDate() + 1)
            dispatch(updateTask({...task, endTime: date.toString()}))
        }
    }

    function updateDurationIfNeeded() {
        const {hours, minutes} = calculateTimeDifference(timeStart, timeEnd)
        const timeParts = totalDuration.split(':')
        const totalTimeDuration = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${timeParts[2]}`
        const timeDuration = (hours <= 999) ? totalTimeDuration : task.totalTime
        if (timeDuration !== totalDuration) {
            dispatch(updateTask({...task, totalTime: timeDuration}))
        }
    }

    useEffect(() => {
        updateEndDateIfNeeded()
        updateDurationIfNeeded()
        
        setStartDateTime(getFormattedTime(timeStart))
        setEndDateTime(getFormattedTime(timeEnd))
        setDuration(task.totalTime)
        setTaskDescription(task.text)
    }, [task.startTime, task.endTime])

    const actionItem = useClickOutside(() => {
        setShowActionItems(false)
    })

    return(
        <div className="task-container">
            <input
                type="text"
                name="task-name"
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                onBlur={() => onTaskBlur(taskDescription, task.id)}
            ></input>
            <AddProject
                projectClient={projectClient}
                project= {projectClient[task.id]?.project || ''}
                client={projectClient[task.id]?.client || ''}
                id={task.id}
            />
            {/* {isRunning && <input disabled className="time" value={totalTime}></input>}
            {!isRunning && <input type='text' className='time' value={duration} onChange={(e) => setDuration(e.target.value)} onBlur={handleDurationBlur} />}
            <button className={`${isRunning ? 'hide' : "track-btns start"}`} onClick={handleStart}><i className ="bi bi-play"></i></button>
            <button className={`${!isRunning ? 'hide' : "track-btns stop"}`} onClick={handleStop}><i className="bi bi-pause"></i></button> */}
            <input
                type="text"
                name="startTime"
                value={startDateTime}
                onChange={(e) => setStartDateTime(e.target.value)}
                onBlur={(e) => onStartBlur(e, task.id)}
            ></input>
            <p>{getFormattedDate(timeStart)}</p>
            <input
                type="text"
                name="endTime"
                value={endDateTime}
                onChange={(e) => setEndDateTime(e.target.value)}
                onBlur={(e) => onEndBlur(e, task.id)}
            ></input>
            <p>{getFormattedDate(timeEnd)}</p>

            <input
                type='text'
                className='duration'
                value={totalDuration}
                onChange={(e) => setDuration(e.target.value)}
                onBlur={(e) => onDurationBlur(e, task.id)}
            />
            <DatePicker
                selected={timeStart}
                onChange={(e) => onDateChange(e, task.id)}
                showTimeSelect={false}
                dateFormat="yyyy-MM-dd"
                customInput={
                    <button>
                        <i className="bi bi-calendar"></i>
                    </button>
                }
            />

            <p className="ms-2">{getFormattedDate(timeStart)}</p>
            <button className="three-dots" onClick={() => setShowActionItems(!showActionItems)}><i className="bi bi-three-dots-vertical"></i></button>
            <div className={showActionItems ? "action-items-container": "hide"} ref={actionItem}>
                <ul>
                    <li>
                    <button onClick={() => {
                        onDuplicate(task.id)
                        setShowActionItems(false)
                    }}>Duplicate</button>
                    </li>
                    <li>
                    <button onClick={() => {
                        onDelete(task.id)
                        setShowActionItems(false)
                    }}>Delete</button>
                    </li>
                </ul>
            </div>

        </div>
    )
}

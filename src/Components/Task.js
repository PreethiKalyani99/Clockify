import React, {useState, useEffect} from "react";
import { useDispatch } from "react-redux";
import DatePicker from "react-datepicker";
import { AddProject } from "./AddProject";
import { getFormattedDate } from "../utils/getFormattedDate";
import { getFormattedTime } from "../utils/getFormattedTime";
import "react-datepicker/dist/react-datepicker.css";
import { updateTask } from "../redux/ClockifySlice";
import { calculateTimeDifference } from "../utils/calculateTimeDifference";

export function Task(props){
    const dispatch = useDispatch()
    const timeStart = new Date(props.task.startTime)
    const timeEnd = new Date(props.task.endTime)
    const [startDateTime, setStartDateTime] = useState(getFormattedTime(timeStart))
    const [endDateTime, setEndDateTime] = useState(getFormattedTime(timeEnd))
    const [totalDuration, setDuration] = useState(props.task.totalTime)
    const [taskDescription, setTaskDescription] = useState(props.task.text)
    const [showActionItems, setShowActionItems] = useState(false)

    function updateEndDateIfNeeded() {
        if (timeStart > timeEnd) {
            let date = new Date(timeEnd)
            date.setDate(date.getDate() + 1)
            dispatch(updateTask({...props.task, endTime: date.toString()}))
        }
    }

    function updateDurationIfNeeded() {
        const {hours, minutes} = calculateTimeDifference(timeStart, timeEnd)
        const timeParts = totalDuration.split(':')
        const totalTimeDuration = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${timeParts[2]}`
        const timeDuration = (hours <= 999) ? totalTimeDuration : props.task.totalTime
        if (timeDuration !== totalDuration) {
            dispatch(updateTask({...props.task, totalTime: timeDuration}))
        }
    }

    useEffect(() => {
        updateEndDateIfNeeded()
        updateDurationIfNeeded()
        
        setStartDateTime(getFormattedTime(timeStart))
        setEndDateTime(getFormattedTime(timeEnd))
        setDuration(props.task.totalTime)
        setTaskDescription(props.task.text)
    }, [props.task.startTime, props.task.endTime])

    return(
        <div className="task-container">
            <input
                type="text"
                name="task-name"
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                onBlur={() => props.onTaskBlur(taskDescription, props.task.id)}
            ></input>
            <AddProject
                projectClient={props.projectClient}
                project= {props.projectClient[props.task.id]?.project || ''}
                client={props.projectClient[props.task.id]?.client || ''}
                id={props.task.id}
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
                onBlur={(e) => props.onStartBlur(e, props.task.id)}
            ></input>
            <p>{getFormattedDate(timeStart)}</p>
            <input
                type="text"
                name="endTime"
                value={endDateTime}
                onChange={(e) => setEndDateTime(e.target.value)}
                onBlur={(e) => props.onEndBlur(e, props.task.id)}
            ></input>
            <p>{getFormattedDate(timeEnd)}</p>

            <input
                type='text'
                className='duration'
                value={totalDuration}
                onChange={(e) => setDuration(e.target.value)}
                onBlur={(e) => props.onDurationBlur(e, props.task.id)}
            />
            <DatePicker
                selected={timeStart}
                onChange={(e) => props.onDateChange(e, props.task.id)}
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
            <div className={showActionItems ? "action-items-container": "hide"}>
                <ul>
                    <li>
                    <button onClick={() => props.onDuplicate(props.task.id)}>Duplicate</button>
                    </li>
                    <li>
                    <button onClick={() => props.onDelete(props.task.id)}>Delete</button>
                    </li>
                </ul>
            </div>

        </div>
    )
}

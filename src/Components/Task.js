import React, {useState, useEffect, useRef} from "react";
import DatePicker from "react-datepicker";
import { AddProject } from "./AddProject";
import { getFormattedDate } from "../utils/getFormattedDate";
import { getFormattedTime } from "../utils/getFormattedTime";
import "react-datepicker/dist/react-datepicker.css";

export function Task(props){
    const timeStart = new Date(props.task.startTime)
    const timeEnd = new Date(props.task.endTime)
    const [startDateTime, setStartDateTime] = useState(getFormattedTime(timeStart));
    const [endDateTime, setEndDateTime] = useState(getFormattedTime(timeEnd));
    const [totalDuration, setDuration] = useState(props.task.totalTime);
    const [taskDescription, setTaskDescription] = useState(props.task.text);

    useEffect(() => {
        setStartDateTime(getFormattedTime(timeStart))
        setEndDateTime(getFormattedTime(timeEnd))
        setDuration(props.task.totalTime)
        setTaskDescription(props.task.text)
    }, [props.timeStart, props.timeEnd]);


    return(
        <div className="task-container">
            <input
                type="text"
                name="task-name"
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                onBlur={(e) => props.onTaskBlur(e, {
                    id: props.task.id,
                    date: props.task.date,
                    text: props.task.text,
                    startTime: props.task.startTime,
                    endTime: props.task.endTime,
                    project: props.task.project,
                    client: props.task.client,
                    totalTime: props.task.totalTime
                })}
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
                onBlur={(e) => props.onStartBlur(e, timeStart, {
                    id: props.task.id,
                    date: props.task.date,
                    text: props.task.text,
                    startTime: props.task.startTime,
                    endTime: props.task.endTime,
                    project: props.task.project,
                    client: props.task.client,
                    totalTime: props.task.totalTime
                })}
            ></input>
            <p>{getFormattedDate(timeStart)}</p>
            <input
                type="text"
                name="endTime"
                value={endDateTime}
                onChange={(e) => setEndDateTime(e.target.value)}
                onBlur={(e) => props.onEndBlur(e, timeEnd, {
                    id: props.task.id,
                    date: props.task.date,
                    text: props.task.text,
                    startTime: props.task.startTime,
                    endTime: props.task.endTime,
                    project: props.task.project,
                    client: props.task.client,
                    totalTime: props.task.totalTime
                })}
            ></input>
            <p>{getFormattedDate(timeEnd)}</p>

            <input
                type='text'
                className='duration'
                value={totalDuration}
                onChange={(e) => setDuration(e.target.value)}
                onBlur={(e) => props.onDurationBlur(e, timeStart, {
                    id: props.task.id,
                    date: props.task.date,
                    text: props.task.text,
                    startTime: props.task.startTime,
                    endTime: props.task.endTime,
                    project: props.task.project,
                    client: props.task.client,
                    totalTime: props.task.totalTime
                })}
            />
            <DatePicker
                selected={timeStart}
                onChange={(e) => props.onDateChange(e, timeEnd, timeStart, {
                    id: props.task.id,
                    date: props.task.date,
                    text: props.task.text,
                    startTime: props.task.startTime,
                    endTime: props.task.endTime,
                    project: props.task.project,
                    client: props.task.client,
                    totalTime: props.task.totalTime
                })}
                showTimeSelect={false}
                dateFormat="yyyy-MM-dd"
                customInput={
                    <button>
                        <i className="bi bi-calendar"></i>
                    </button>
                }
            />

            <p className="ms-2">{getFormattedDate(timeStart)}</p>
            <button className="three-dots" onClick={props.toggleAction}><i className="bi bi-three-dots-vertical"></i></button>
            <div className={props.showActionItems ? "action-items-container": "hide"}>
                <ul>
                    <li>
                    <button>Duplicate</button>
                    </li>
                    <li>
                    <button>Delete</button>
                    </li>
                </ul>
            </div>

        </div>
    )
}

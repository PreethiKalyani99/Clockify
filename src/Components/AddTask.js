import React, { useEffect, useState } from "react";
import { AddProject } from "./AddProject";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getFormattedDate } from "../utils/getFormattedDate";
import { getFormattedTime } from "../utils/getFormattedTime";
import { calculateDays } from "../utils/calculateDays";

export function AddTask(props) {

    const [startTime, setStartTime] = useState(getFormattedTime(props.timeStart));
    const [endTime, setEndTime] = useState(getFormattedTime(props.timeEnd));
    const [duration, setDuration] = useState(props.duration);
    const [taskName, setTaskName] = useState(props.taskName);

    const days = calculateDays(props.timeStart, props.timeEnd)

    const handleEnter = (e) => {
        if (e.key === 'Enter') {
            props.onAddTask()
        }
    }

    useEffect(() => {
        const formattedStartTime = getFormattedTime(props.timeStart);
        if (startTime !== formattedStartTime) {
            setStartTime(e => formattedStartTime);
        }

        const formattedEndime = getFormattedTime(props.timeEnd);
        if (endTime !== formattedEndime) {
            setEndTime(formattedEndime);
        }

        if (duration !== props.duration) {
            setDuration(props.duration)
        }

        if (taskName !== props.taskName) {
            setTaskName(props.taskName)
        }
    }, [props.timeStart, props.timeEnd, props.duration, props.taskName]);

    return (
        <>
            <div className={props.isModalOpen ? "add-task-container" : "add-task-container zIndex"}
                 data-testid="container">
                <input
                    data-testid="task-name"
                    type="text"
                    placeholder="What are you working on?"
                    className={props.isSidebarShrunk ? "input-box expand-input-width" : "input-box shrink-input-width"}
                    onChange={(e) => setTaskName(e.target.value)}
                    onBlur={props.onNameChange}
                    onKeyDown={handleEnter}
                ></input>
                <AddProject
                    projectClient={props.projectClient}
                    id={props.uniqueId}
                    project=''
                    client=''
                />
                <input
                    data-testid="start-time"
                    type="text"
                    name="startTime"
                    onBlur={props.onStartBlur}
                    onChange={e => setStartTime(e.target.value)}
                    value={startTime}
                ></input>
                <input
                    data-testid="end-time"
                    type="text"
                    name="endTime"
                    onBlur={props.onEndBlur}
                    onChange={(e) => setEndTime(e.target.value)}
                    value={endTime}
                ></input>
                {days > 0 && <sup className="fs-6"><b>{'+' + days}</b></sup>}
                <input
                    data-testid="task-duration"
                    type='text'
                    className='duration'
                    onBlur={props.onDurationBlur}
                    onChange={(e) => setDuration(e.target.value)}
                    value={duration}
                />
                <DatePicker
                    id="date-picker"
                    selected={props.timeStart}
                    onChange={props.onDateChange}
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
                >{getFormattedDate(props.timeStart)}</p>
                <button onClick={props.onAddTask} data-testid="add-task">
                    Add
                </button>
        
            </div>
        </>
    )
}

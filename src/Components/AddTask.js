import React from "react";
import { AddProject } from "./AddProject";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getFormattedDate } from "../utils/getFormattedDate";
import { calculateDays } from "../utils/calculateDays";

export function AddTask(props) {
    const days = calculateDays(props.timeStart, props.timeEnd)

    const handleEnter = (e) => {
        if (e.key === 'Enter') {
            props.onAddTask()
        }
    }

    return (
        <>
            <div className={props.isModalOpen ? "add-task-container" : "add-task-container zIndex"} data-testid="container">
                <input
                    data-testid="task-name"
                    type="text"
                    placeholder="What are you working on?"
                    className={props.isSidebarShrunk ? "input-box expand-input-width" : "input-box shrink-input-width"}
                    onChange={props.onNameChange}
                    onBlur={props.onTaskBlur}
                    value={props.taskDescription}
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
                    onChange={props.onStartChange}
                    value={props.start}
                ></input>
                <input
                    data-testid="end-time"
                    type="text"
                    name="endTime"
                    onBlur={props.onEndBlur}
                    onChange={props.onEndChange}
                    value={props.end}
                ></input>
                {days > 0 && <sup className="fs-6"><b>{'+' + days}</b></sup>}
                <input
                    data-testid="task-duration"
                    type='text'
                    className='duration'
                    onBlur={props.onDurationBlur}
                    onChange={props.onDurationChange}
                    value={props.totalDuration}
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

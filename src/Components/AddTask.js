import React, { useRef } from "react";
import { AddProject } from "./AddProject";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getFormattedDate } from "../utils/getFormattedDate";
import { getFormattedTime } from "../utils/getFormattedTime";
import { calculateDays } from "../utils/calculateDays";

export function AddTask(props){

    const startTimeRef = useRef()
    const endTimeRef = useRef()
    const totalDurationRef = useRef()
    const taskNameRef = useRef()

    // console.log(props.timeStart, props.timeEnd, props.duration, props.taskName, "props")
    startTimeRef.current = `${(props.timeStart.getHours()).toString().padStart(2, '0')}:${(props.timeStart.getMinutes()).toString().padStart(2, '0')}`
    endTimeRef.current = `${(props.timeEnd.getHours()).toString().padStart(2, '0')}:${(props.timeEnd.getMinutes()).toString().padStart(2, '0')}`
    totalDurationRef.current = props.duration
    taskNameRef.current = props.taskName
   
    const handleKey = (e) => {
        if(e.key === 'Enter'){
            props.onAddTask()
        }
    }
    const days = calculateDays(props.timeStart, props.timeEnd)

    return(
        <>
            <div className={props.isModalOpen ? "add-task-container" : "add-task-container zIndex"} data-testid="container">
                <input
                    data-testid="task-name"
                    type="text"
                    placeholder="What are you working on?"
                    className={props.isSidebarShrunk ?  "input-box expand-input-width" : "input-box shrink-input-width"}
                    onKeyDown={handleKey}
                    ref={taskNameRef}
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
                    ref={startTimeRef}
                    onBlur={props.onStartBlur}
                    defaultValue={getFormattedTime(props.timeStart)}
                ></input>
                <input
                    data-testid="end-time"
                    type="text"
                    name="endTime"
                    ref={endTimeRef}
                    onBlur={props.onEndBlur}
                    defaultValue={getFormattedTime(props.timeEnd)}
                ></input>
                {days > 0 && <sup className="fs-6"><b>{'+' + days}</b></sup>}
                
                <input
                    data-testid="task-duration"
                    type='text'
                    className='duration'
                    ref={totalDurationRef}
                    onBlur={props.onDurationBlur}
                    defaultValue='00:00:00'
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

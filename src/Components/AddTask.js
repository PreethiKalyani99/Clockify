import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getFormattedDate } from "../utils/getFormattedDate";
import { calculateDays } from "../utils/calculateDays";
import { Project } from "./Project";
import circledPlusIcon from '../assets/icons/circledPlusIcon.png'

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
                    className="input-box "
                    onChange={props.onNameChange}
                    value={props.taskDescription}
                    onKeyDown={handleEnter}
                ></input>
                <div className="sub-container">
                    <button onClick={props.onToggle} className={!props.selectedProject.value ? "project-text-color project-text" : 'project-text'}>
                        {!props.selectedProject.value && <img src={circledPlusIcon} alt="Circled Plus Icon" style={{ width: '20px', height: '20px', marginRight: '5px'}}/>}
                        {`${props?.selectedProject?.label}${props?.selectedClient?.label && ' - '}${props?.selectedClient?.label}`}
                    </button>
                    <input
                        className="startTimeBox"
                        data-testid="start-time"
                        type="text"
                        name="startTime"
                        onBlur={props.onStartBlur}
                        onChange={props.onStartChange}
                        value={props.start}
                    ></input>
                    <span className="mt-2 ms-2 me-2">-</span>
                    <input
                        className="endTimeBox"
                        data-testid="end-time"
                        type="text"
                        name="endTime"
                        onBlur={props.onEndBlur}
                        onChange={props.onEndChange}
                        value={props.end}
                    ></input>
                    {days > 0 && <sup className="days"><b>{'+' + days}</b></sup>}
                    <DatePicker
                        className="dateIcon"
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
                    <p className="date-text mt-2">
                        {getFormattedDate(props.timeStart)}
                    </p>
                    <input
                        data-testid="task-duration"
                        type='text'
                        className='durationBox'
                        onBlur={props.onDurationBlur}
                        onChange={props.onDurationChange}
                        value={props.totalDuration}
                    />
                    <button onClick={props.onAddTask} data-testid="add-task" className="addButton">
                        Add
                    </button>
                </div>
            </div>
            <div className= {props.showProjects ? "project-dropdown" : ''} ref={props.projectDropdowm}>
                {props.showProjects && 
                    <Project 
                        onSelect={props.onSelect}
                        setShowProjects={props.setShowProjects}
                        selectedProject={props.selectedProject}
                        selectedClient={props.selectedClient}
                        projects={props.projects} 
                        clients={props.clients}
                    />
                }    
            </div>
        </>
    )
}

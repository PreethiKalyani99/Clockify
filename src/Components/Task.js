import React, {useState, useEffect} from "react";
import { useDispatch } from "react-redux";
import DatePicker from "react-datepicker";
import { getFormattedTime } from "../utils/getFormattedTime";
import "react-datepicker/dist/react-datepicker.css";
import { updateTimer } from "../redux/ClockifySlice";
import { updateTimeEntry } from "../redux/clockifyThunk";
import useClickOutside from "../utils/useClickOutside";
import { calculateDays } from "../utils/calculateDays";
import { parseISODuration } from "../utils/parseISODuration";
import { Project } from "./Project";
import circledPlusIcon from '../assets/icons/circledPlusIcon.png'
import threeDotsIcon from '../assets/icons/menu.png'

export function Task({task, projects, clients, onTaskBlur, onStartBlur, onEndBlur, onDurationBlur, onDateChange, onDelete, onDuplicate, toggleTimer}){
    const dispatch = useDispatch()
    const timeStart = new Date(task.timeInterval.start)
    const timeEnd = new Date(task.timeInterval.end)
    const [startDateTime, setStartDateTime] = useState(getFormattedTime(timeStart) || '00:00')
    const [endDateTime, setEndDateTime] = useState(getFormattedTime(timeEnd) || '00:00')
    const [totalDuration, setDuration] = useState(parseISODuration(task.timeInterval.duration || '00:00:00'))
    const [taskDescription, setTaskDescription] = useState(task.description)
    const [showActionItems, setShowActionItems] = useState(false)
    const [showProjects, setShowProjects] = useState(false) 

    const [projectSelected, setProjectSelected] = useState({value: task?.projectId || '', label: task?.project?.name  || 'Project'})
    const [clientSelected, setClientSelected] = useState({value: task?.project?.clientId  || '', label: task?.project?.clientName  || ''})

    useEffect(() => {
        if(getFormattedTime(timeStart) !== startDateTime || getFormattedTime(timeEnd) !== endDateTime || parseISODuration(task.timeInterval.duration) !== totalDuration || taskDescription !== task.description){
            setStartDateTime(getFormattedTime(timeStart))
            setEndDateTime(getFormattedTime(timeEnd))
            setDuration(parseISODuration(task.timeInterval.duration))
            setTaskDescription(task.description)
            if(projectSelected.value !== task.projectId){
                setProjectSelected({value: task.projectId, label: task?.project?.name || projectSelected.label})
                setClientSelected({value: task?.project?.clientId || projectSelected.clientId, label: task?.project?.clientName || projectSelected.label})
            }
        }
    }, [task.timeInterval.start, task.timeInterval.end, task.timeInterval.duration, task.description])

    useEffect(() => {
        const projectValue = projects?.find(project => project.id === projectSelected.value)
        if(projectValue){
            setProjectSelected({value: projectValue?.id, label: projectValue?.name})
            setClientSelected({value: projectValue.clientId, label: projectValue.clientName})
        }
    }, [projects, projectSelected.value])
    
    const actionItem = useClickOutside(() => {
        setShowActionItems(false)
    })

    const days = calculateDays(timeStart, timeEnd)  

    const handleSelect = (value) => {
        setProjectSelected(value)
        setShowProjects(false)
        dispatch(updateTimeEntry({
            id: task.id, 
            start: task.timeInterval.start, 
            end: task.timeInterval.end, 
            description: task.description,
            projectId: value.value
        }))
    }
    return(
        <>
            <div className="task-container">
                <input
                    className="description-display"
                    type="text"
                    name="task-name"
                    value={taskDescription || ''}
                    onChange={(e) => setTaskDescription(e.target.value)}
                    onBlur={() => onTaskBlur(taskDescription, task.id)}
                ></input>
                <button 
                    onClick={() => setShowProjects(!showProjects)}
                    className={!projectSelected.value ? "project-text-color project-text" : "project-text"}
                >  
                    {!projectSelected.value && <img src={circledPlusIcon} alt="Circled Plus Icon" style={{ width: '20px', height: '20px', marginRight: '5px'}}/>}
                    {`${projectSelected.label}${clientSelected.label && ' - '}${clientSelected.label}`}
                </button> 
                <div className="task-time-container">
                    <input
                        className="startTimeBox"
                        type="text"
                        name="startTime"
                        value={startDateTime || '00:00'}
                        onChange={(e) => setStartDateTime(e.target.value)}
                        onBlur={(e) => onStartBlur(e, task.id, task.timeInterval.end)}
                    ></input>
                    <span className="ms-2 me-2">-</span>
                    <input
                        className="endTimeBox"
                        type="text"
                        name="endTime"
                        value={endDateTime || '00:00'}
                        onChange={(e) => setEndDateTime(e.target.value)}
                        onBlur={(e) => onEndBlur(e, task.id, task.timeInterval.start)}
                    ></input>
                    {days > 0 && <sup className="task-days"><b>{'+' + days}</b></sup>}
                    <DatePicker
                        className="dateIcon"                    
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
                    <input
                        type='text'
                        className='durationBox'
                        value={totalDuration || '00:00:00'}
                        onChange={(e) => setDuration(e.target.value)}
                        onBlur={(e) => onDurationBlur(e, task.id)}
                    />
                    <button 
                        onClick={() => {
                            toggleTimer()
                            dispatch(updateTimer({name: task.description, project: projectSelected.label, projectId: task.projectId, client: clientSelected.label, clientId: clientSelected.value}))
                        }}
                        className="play-button"
                    >
                        <i className ="bi bi-play"></i>
                    </button>
                </div>
                <button className="three-dots" onClick={() => setShowActionItems(!showActionItems)}>
                    <img src={threeDotsIcon} alt="menu Icon" style={{ width: '25px', height: '25px'}}/>
                </button>
                <div className={showActionItems ? "action-items-container": "hide"} ref={actionItem}>
                    <ul className="action-items">
                        <li>
                        <button 
                            onClick={() => {
                                onDuplicate(task.id)
                                setShowActionItems(false)
                            }}
                            className="duplicate-btn"
                        >Duplicate</button>
                        </li>
                        <li>
                        <button 
                            onClick={() => {
                                onDelete(task.id)
                                setShowActionItems(false)
                            }}
                            className="delete-btn"
                        >Delete</button>
                        </li>
                    </ul>
                </div>
            </div>
            <div className= {showProjects ? "" : ''}>
                {showProjects && 
                    <Project 
                        onSelect={handleSelect}
                        setShowProjects={setShowProjects}
                        selectedProject={projectSelected}
                        setProjectSelected={setProjectSelected}
                        selectedClient={clientSelected}
                        setClientSelected={setClientSelected}
                        task={task}
                        projects={projects} 
                        clients={clients}
                    />
                }    
            </div>
        </>
    )
}

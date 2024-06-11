import React, {useState, useEffect} from "react";
import { useDispatch } from "react-redux";
import DatePicker from "react-datepicker";
import { getFormattedDate } from "../utils/getFormattedDate";
import { getFormattedTime } from "../utils/getFormattedTime";
import "react-datepicker/dist/react-datepicker.css";
import { updateTimer, addProjectClient } from "../redux/ClockifySlice";
import { updateTimeEntry } from "../redux/clockifyThunk";
import useClickOutside from "../utils/useClickOutside";
import { calculateDays } from "../utils/calculateDays";
import { parseISODuration } from "../utils/parseISODuration";
import { Project } from "./Project";

export function Task({task, projects, clients, onTaskBlur, onStartBlur, onEndBlur, onDurationBlur, onDateChange, onDelete, onDuplicate, uniqueId, toggleTimer}){
    const dispatch = useDispatch()
    const timeStart = new Date(task.timeInterval.start)
    const timeEnd = new Date(task.timeInterval.end)
    const [startDateTime, setStartDateTime] = useState(getFormattedTime(timeStart) || '00:00')
    const [endDateTime, setEndDateTime] = useState(getFormattedTime(timeEnd) || '00:00')
    const [totalDuration, setDuration] = useState(parseISODuration(task.timeInterval.duration || '00:00:00'))
    const [taskDescription, setTaskDescription] = useState(task.description)
    const [showActionItems, setShowActionItems] = useState(false)
    const [showProjects, setShowProjects] = useState(false) 

    const [projectSelected, setProjectSelected] = useState({value: task?.project?.id || '', label: task?.project?.name  || 'Project'})
    const [clientSelected, setClientSelected] = useState({value: task?.project?.clientId  || '', label: task?.project?.clientName  || ''})


    function updateEndDateIfNeeded() {
        if (timeStart > timeEnd) {
            let date = new Date(timeEnd)
            date.setDate(date.getDate() + 1)
            dispatch(updateTimeEntry({
                start: timeStart.toISOString().split('.')[0] + 'Z',
                end: date.toISOString().split('.')[0] + 'Z',
                id: task.id
            }))
        }
    }

    useEffect(() => {
        if(getFormattedTime(timeStart) !== startDateTime || getFormattedTime(timeEnd) !== endDateTime || parseISODuration(task.timeInterval.duration) !== totalDuration || taskDescription !== task.description){
            setStartDateTime(getFormattedTime(timeStart))
            setEndDateTime(getFormattedTime(timeEnd))
            setDuration(parseISODuration(task.timeInterval.duration))
            setTaskDescription(task.description)
        }
        updateEndDateIfNeeded()
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
                    type="text"
                    name="task-name"
                    value={taskDescription || ''}
                    onChange={(e) => setTaskDescription(e.target.value)}
                    onBlur={() => onTaskBlur(taskDescription, task.id)}
                ></input>
                <button onClick={() => {
                    setShowProjects(!showProjects)
                }}>{`${projectSelected.label}${clientSelected.label && ' - '}${clientSelected.label}`}</button> 
                <input
                    type="text"
                    name="startTime"
                    value={startDateTime || '00:00'}
                    onChange={(e) => setStartDateTime(e.target.value)}
                    onBlur={(e) => onStartBlur(e, task.id, task.timeInterval.end)}
                ></input>
                <input
                    type="text"
                    name="endTime"
                    value={endDateTime || '00:00'}
                    onChange={(e) => setEndDateTime(e.target.value)}
                    onBlur={(e) => onEndBlur(e, task.id, task.timeInterval.start)}
                ></input>
                {days > 0 && <sup className="fs-6"><b>{'+' + days}</b></sup>}
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
                <input
                    type='text'
                    className='duration'
                    value={totalDuration || '00:00:00'}
                    onChange={(e) => setDuration(e.target.value)}
                    onBlur={(e) => onDurationBlur(e, task.id)}
                />
                <button onClick={() => {
                    toggleTimer()
                    dispatch(updateTimer({name: task.description, project: task?.project, client: task?.client}))
                    dispatch(addProjectClient({id: uniqueId, project: task?.project?.projectName, client: task?.project?.client}))
                }}><i className ="bi bi-play"></i></button>
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

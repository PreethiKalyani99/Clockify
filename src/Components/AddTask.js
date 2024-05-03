import React, {useState} from "react";
import { addTodayTask, updateUniqueId } from "../redux/ClockifySlice";
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
    const {projectClient , uniqueId, isModalOpen} = useSelector(state => state.clockify)

    const [taskName, setTaskName] = useState('')

    const [startTime, setStartTime] = useState(new Date())
    const [formattedStartTime, setFormattedStartTime] = useState(getFormattedTime(startTime))

    const [endTime, setEndTime] = useState(new Date())
    const [formattedEndTime, setFormattedEndTime] = useState(getFormattedTime(endTime))

    const [totalDuration, setTotalDuration] = useState('00:00:00')

    const [previousTime, setPreviousTime] = useState({
        start: getFormattedTime(startTime),
        end: getFormattedTime(endTime),
        duration: '00:00:00'
    })

    const dispatch = useDispatch()

    const handleStartTimeChange = (e) => {
        setFormattedStartTime(e.target.value)
    }

    const handleEndTimeChange = (e) => {
        setFormattedEndTime(e.target.value)
    }

    const handleKey = (e) => {
        if(e.key === 'Enter'){
            addTask()
        }
    }

    const handleInputChange = (e) => {
        setTaskName(e.target.value)
    }

    const handleDateChange = (dateTime) => {
        setStartTime(dateTime)
        setEndTime(calculateEndDate(dateTime, endTime))
    }

    const handleStartTimeBlur = (e) => {
        const {isValid, validatedHour, validatedMins} = validateTime(e.target.value, getFormattedDate(startTime))
        if(isValid){
            setFormattedStartTime(`${validatedHour.toString().padStart(2,'0')}:${validatedMins.toString().padStart(2,'0')}`)
            startTime.setHours(validatedHour, validatedMins)
            setStartTime(startTime)
        }
        else{
            setFormattedStartTime(`${startTime.getHours().toString().padStart(2,'0')}:${startTime.getMinutes().toString().padStart(2,'0')}`)
        }
        const {hours, minutes} = calculateTimeDifference(startTime, endTime)
        setTotalDuration(`${hours}:${minutes}:00`)
    }

    const handleEndTimeBlur = (e) => {
        const {isValid, validatedHour, validatedMins} = validateTime(e.target.value, getFormattedDate(endTime))
        if(isValid){
            setFormattedEndTime(`${validatedHour.toString().padStart(2,'0')}:${validatedMins.toString().padStart(2,'0')}`)
            endTime.setHours(validatedHour, validatedMins)
            setEndTime(endTime)
        }
        else{
            setFormattedEndTime(`${endTime.getHours().toString().padStart(2,'0')}:${endTime.getMinutes().toString().padStart(2,'0')}`)
        }

        if(startTime.getHours() > endTime.getHours() && (startTime.getDate() - endTime.getDate() === 0 || Math.abs(startTime.getDate() - endTime.getDate()) === 1)){
            endTime.setDate(startTime.getDate() + 1)
            setEndTime(endTime)
        }
        else{
            endTime.setFullYear(startTime.getFullYear(), startTime.getMonth(), startTime.getDate())
            setEndTime(endTime)
        }
        const {hours, minutes} = calculateTimeDifference(startTime, endTime)
        setTotalDuration(`${hours}:${minutes}:00`)
    }

    const handleTotalDurationBlur = (e) => {
        const {isValid, newEndTime, timeDuration} = calculateEndTime(startTime, e.target.value)
        if(isValid){
            setFormattedEndTime(`${(newEndTime.getHours()).toString().padStart(2,'0')}:${(newEndTime.getMinutes()).toString().padStart(2,'0')}`)
            setEndTime(newEndTime)
            setTotalDuration(timeDuration)
            setPreviousTime({...previousTime, duration: timeDuration})
        }
        else{
            setTotalDuration(previousTime.duration)
        }
    }

    const addTask = () => {
        if(taskName !== ''){
            dispatch(addTodayTask({
                date: getFormattedDate(startTime),
                id: uniqueId,
                text: taskName,
                totalTime: totalDuration,
                project: projectClient?.[uniqueId]?.project,
                client: projectClient?.[uniqueId]?.client,
                startTime: new Date(startTime),
                endTime:  new Date(endTime)
            }))
            dispatch(updateUniqueId())
            setTaskName('')
            setStartTime(new Date())
            setEndTime(new Date())
            setTotalDuration('00:00:00')
            setFormattedStartTime(`${(new Date().getHours()).toString().padStart(2,'0')}:${(new Date().getMinutes()).toString().padStart(2,'0')}`)
            setFormattedEndTime(`${(new Date().getHours()).toString().padStart(2,'0')}:${(new Date().getMinutes()).toString().padStart(2,'0')}`)
        }
        else{
            alert('Please enter task description')
        }
    }

    return(
        <>
            <div className = {isModalOpen ? "add-task-container": "add-task-container zIndex"}>
                <input 
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
                <button onClick={addTask}>Add</button>
                <input
                    data-testid="start-time"
                    type="text"
                    name="startTime"
                    value={formattedStartTime}
                    onChange={handleStartTimeChange}
                    onBlur={handleStartTimeBlur}
                ></input>
                <p>{startTime.toISOString()}</p>
                <input 
                    type="text" 
                    name="endTime"
                    value={formattedEndTime}
                    onChange={handleEndTimeChange}
                    onBlur={handleEndTimeBlur}
                ></input>
                <p>{endTime.toISOString()}</p>
                <input 
                    type='text' 
                    className='duration' 
                    value={totalDuration} 
                    onChange={(e) => setTotalDuration(e.target.value)} 
                    onBlur={handleTotalDurationBlur} 
                />
                <DatePicker
                    selected={startTime}
                    onChange={handleDateChange}
                    showTimeSelect={false}
                    dateFormat="yyyy-MM-dd"
                    customInput={
                        <button>
                            <i className="bi bi-calendar"></i>
                        </button>
                    }
                />
                <p className="ms-2">{getFormattedDate(startTime)}</p>
            </div>
        </>
    )
}
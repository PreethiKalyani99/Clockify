import React, {useState, useEffect, useRef} from "react";
import { useDispatch, useSelector } from "react-redux";
import { addTodayTask, updateTask, deleteTask, updateUniqueId } from "../redux/ClockifySlice";
import DatePicker from "react-datepicker";
import { validateTime } from "../utils/validateTime";
import { calculateTimeDifference } from "../utils/calculateTimeDifference";
import { calculateEndTime } from "../utils/calculateEndTime";
import { AddProject } from "./AddProject";
import { getFormattedDate } from "../utils/getFormattedDate";
import { getFormattedTime } from "../utils/getFormattedTime";
import { calculateEndDate } from "../utils/calculateEndDate";
import "react-datepicker/dist/react-datepicker.css";

export function DisplaySingleTask(props){
    const {uniqueId, projectClient, totalTasks} = useSelector(state => state.clockify)
    const [isRunning, setIsRunning] = useState(false)
    const [elapsedTime, setElapsedTime] = useState(0)
    const [taskName, setTaskName] = useState(props.task.text)

    const [startTime, setStartTime] = useState(new Date(props.task.startTime))
    const [formattedStartTime, setFormattedStartTime] = useState(getFormattedTime(startTime))

    const [endTime, setEndTime] = useState(new Date(props.task.endTime))
    const [formattedEndTime, setFormattedEndTime] = useState(getFormattedTime(endTime))

    const [totalDuration, setTotalDuration] = useState(props.task.totalTime)

    const [previousTime, setPreviousTime] = useState({
        start: getFormattedTime(startTime),
        end: getFormattedTime(endTime),
        duration: '00:00:00'
    })
    const [showActionItems, setShowActionItems] = useState(false)
    
    const intervalIdRef = useRef(null)

    const dispatch = useDispatch()

    useEffect(() => {
        if (isRunning) {
          intervalIdRef.current = setInterval(() => {
              setElapsedTime((prevElapsedTime) => prevElapsedTime + 1000) 
          }, 1000)
        } else {
            clearInterval(intervalIdRef.current)
            intervalIdRef.current = null 
        }
        return () => clearInterval(intervalIdRef.current)
    }, [isRunning])

    const handleStartTimeChange = (e) => {
        setFormattedStartTime(e.target.value)
    }

    const handleEndTimeChange = (e) => {
        setFormattedEndTime(e.target.value)
    }

    const handleDateChange = (dateTime) => {
        
        const updatedEndTime = calculateEndDate(dateTime, endTime, startTime)
        console.log(updatedEndTime, "updated end time")
        setStartTime(dateTime)
        setEndTime(updatedEndTime)
        
        dispatch(addTodayTask({
            id: props.task.id,
            date: getFormattedDate(dateTime),
            startTime: new Date(dateTime),
            endTime: updatedEndTime,
            text: props.task.text,
            project: props.task.project,
            client: props.task.client,
            totalTime: props.task.totalTime
        }))
        
        dispatch(deleteTask({
            id: props.task.id,
            date: props.task.date
        }))
    }

    const handleStart = () => {
        setIsRunning(true)
        setElapsedTime(0)
    }

    const handleStop = () => {
        // setTotalDuration(totalTime)
        dispatch(updateTask({
            id:props.task.id,
            date:  getFormattedDate(startTime),
            // totalTime: totalTime
        }))
        setIsRunning(false)
    }

    const handleStartTimeBlur = (e) => {
        const {isValid, validatedHour, validatedMins} = validateTime(e.target.value, getFormattedDate(startTime))
        if(isValid){
            setFormattedStartTime(`${validatedHour.toString().padStart(2,'0')}:${validatedMins.toString().padStart(2,'0')}`)
            setPreviousTime({...previousTime, start: `${validatedHour.toString().padStart(2,'0')}:${validatedMins.toString().padStart(2,'0')}`})
            startTime.setHours(validatedHour, validatedMins)
            setStartTime(startTime)
        }
        else{
            setFormattedStartTime(previousTime.start)
        }
        const {hours, minutes} = calculateTimeDifference(startTime, endTime)
        setTotalDuration(`${hours}:${minutes}:00`)
        setPreviousTime({...previousTime, duration: `${hours}:${minutes}:00`})
        dispatch(updateTask({
            id: props.task.id,
            date: props.task.date,
            startTime: startTime,
            endTime: endTime,
            totalTime: `${hours}:${minutes}:00`  
        }))
    }

    const handleEndTimeBlur = (e) => {
        const {isValid, validatedHour, validatedMins} = validateTime(e.target.value, getFormattedDate(endTime))
        if(isValid){
            setFormattedEndTime(`${validatedHour.toString().padStart(2,'0')}:${validatedMins.toString().padStart(2,'0')}`)
            setPreviousTime({...previousTime, end: `${validatedHour.toString().padStart(2,'0')}:${validatedMins.toString().padStart(2,'0')}`})
            endTime.setHours(validatedHour, validatedMins)
            setEndTime(endTime)
        }
        else{
            setFormattedEndTime(previousTime.end)
        }
        console.log(startTime, endTime, "start and end in end")
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
        setPreviousTime({...previousTime, duration: `${hours}:${minutes}:00`})
        dispatch(updateTask({
            id: props.task.id,
            date: props.task.date,
            startTime: startTime,
            endTime: endTime,
            totalTime: `${hours}:${minutes}:00`  
        }))
    }

    const handleTotalDurationBlur = (e) => {
        const {isValid, newEndTime, timeDuration} = calculateEndTime(startTime, e.target.value)
        console.log(isValid, newEndTime, timeDuration, "display")

        if(isValid){
            setFormattedEndTime(`${(newEndTime.getHours()).toString().padStart(2,'0')}:${(newEndTime.getMinutes()).toString().padStart(2,'0')}`)
            setEndTime(newEndTime)
            setTotalDuration(timeDuration)
            setPreviousTime({...previousTime, duration: timeDuration})
        }
        else{
            setTotalDuration(previousTime.duration)
        }

        setEndTime(newEndTime)
        dispatch(updateTask({
            id: props.task.id,
            date: props.task.date,
            startTime: startTime,
            endTime: newEndTime,
            totalTime: isValid ? timeDuration :  previousTime.duration     
        }))
    }
 console.log(totalTasks, "total task")
    const handleDeleteTask = () => {
        dispatch(deleteTask({
            id: props.task.id,
            date: props.task.date
        }))
        setShowActionItems(false)
    }

    const handleDuplicateTask = () => {
        dispatch(addTodayTask({
            id: uniqueId,
            date: props.task.date,
            startTime: props.task.startTime,
            endTime: props.task.endTime,
            text: props.task.text,
            project: props.task.project,
            client: props.task.client,
            totalTime: props.task.totalTime
        }))
        dispatch(updateUniqueId())
        setShowActionItems(false)
    }
    // const totalTime = formatTime(elapsedTime)

    const handleTaskNameBlur = (e) => {
        const input = e.target.value
        setTaskName(input)
        dispatch(updateTask({
            id: props.task.id,
            date: props.task.date,
            text: input      
        }))
    }

    return(
        <div className="task-container">
            <input 
                type="text"
                name="task-name"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                onBlur={handleTaskNameBlur}
            ></input>
            <AddProject
                projectClient={projectClient}
                project= {projectClient[props.task.id]?.project || ''}
                client={projectClient[props.task.id]?.client || ''}
                id={props.task.id}
            />
            {/* {isRunning && <input disabled className="time" value={totalTime}></input>}
            {!isRunning && <input type='text' className='time' value={duration} onChange={(e) => setDuration(e.target.value)} onBlur={handleDurationBlur} />}
            <button className={`${isRunning ? 'hide' : "track-btns start"}`} onClick={handleStart}><i className ="bi bi-play"></i></button>
            <button className={`${!isRunning ? 'hide' : "track-btns stop"}`} onClick={handleStop}><i className="bi bi-pause"></i></button> */}
            <input 
                type="text" 
                name="startTime"
                value={formattedStartTime}
                onChange={handleStartTimeChange}
                onBlur={handleStartTimeBlur}
            ></input>
            <p>{getFormattedDate(startTime)}</p>
            <input 
                type="text" 
                name="endTime"
                value={formattedEndTime}
                onChange={handleEndTimeChange}
                onBlur={handleEndTimeBlur}
            ></input>
            <p>{getFormattedDate(endTime)}</p>

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
            <button className="three-dots" onClick={() => setShowActionItems(!showActionItems)}><i className="bi bi-three-dots-vertical"></i></button>
            <div className={showActionItems ? "action-items-container": "hide"}>
                <ul>
                    <li>
                    <button onClick={handleDuplicateTask}>Duplicate</button>
                    </li>
                    <li>
                    <button onClick={handleDeleteTask}>Delete</button>               
                    </li>
                </ul>
            </div>
            
        </div>
    )
}
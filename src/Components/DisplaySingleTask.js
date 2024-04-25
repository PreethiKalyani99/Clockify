import React, {useState, useEffect, useRef} from "react";
import { useDispatch } from "react-redux";
import { updateTask, deleteTask, updateUniqueId } from "../redux/ClockifySlice";
import DatePicker from "react-datepicker";
import { validateTime } from "../utils/validateTime";
import { splitTime } from "../utils/splitTime";
import { calculateTimeDifference } from "../utils/calculateTimeDifference";
import { inputDateTime } from "../utils/inputDateTime";
import { stringPadStart } from "../utils/stringPadStart";
import { calculateEndTime } from "../utils/calculateEndTime";
import { formatTime } from "../utils/formatTime";
import { AddProject } from "./AddProject";
import "react-datepicker/dist/react-datepicker.css";


export function DisplaySingleTask(props){
    const [isRunning, setIsRunning] = useState(false)
    const [startTime, setStartTime] = useState(null)
    const [elapsedTime, setElapsedTime] = useState(0)
    const [inputTime, setInputTime] = useState(props.task.totalTime)
    const [taskName, setTaskName] = useState(props.task.text)
    const [isProjectCreated, setIsProjectCreated] = useState(false)

    const [timeValue, setTimeValue] = useState({
        start: props.task.startTime.toString(),
        end: props.task.endTime.toString()
    })
    const [previousValue, setPreviousValue] = useState({
        start: timeValue.start,
        end: timeValue.end
    })
    const intervalIdRef = useRef(null)

    const currentDateTime = new Date()
    const day = currentDateTime.getDate()
    const month = currentDateTime.getMonth() + 1
    const year = currentDateTime.getFullYear()
    const [dateValue, setDateValue] = useState(`${year}-${month.toString().padStart(2, '0')}-${day}`)
    const [showActionItems, setShowActionItems] = useState(false)
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

    const handleStart = () => {
        setIsRunning(true)
        const [hours, minutes, seconds] = inputTime.split(":").map(Number)
        const inputTimeInMs = (hours * 60 * 60 + minutes * 60 + seconds) * 1000
        setElapsedTime(inputTimeInMs)
        setStartTime(Date.now() - inputTimeInMs)
    }

    const handleStop = () => {
        setInputTime(totalTime)
        dispatch(updateTask({
            id:props.task.id,
            date: props.task.date,
            totalTime: totalTime
        }))
        setIsRunning(false)
    }

    const handleBlur = (e) => {
        let startTimeValidation, endTimeValidation, startTime = timeValue.start, endTime = timeValue.end
        if(e.target.name === 'start'){
            startTimeValidation = validateTime(e.target.value, previousValue[e.target.name])
            if(startTimeValidation.isValid){
                setTimeValue({...timeValue, [e.target.name]: `${startTimeValidation.validatedHour}:${startTimeValidation.validatedMins}`})
                setPreviousValue({...previousValue, [e.target.name]: startTimeValidation.prevTime}) 
                startTime = `${startTimeValidation.validatedHour}:${startTimeValidation.validatedMins}`
            }
            else{
                setTimeValue({...timeValue, [e.target.name]: startTimeValidation.prevTime})
                setPreviousValue({...previousValue, [e.target.name]: startTimeValidation.prevTime})
                startTime = startTimeValidation.prevTime
            }
        }
        else{
            endTimeValidation = validateTime(e.target.value, previousValue[e.target.name])
            if(endTimeValidation.isValid){
                setTimeValue({...timeValue, [e.target.name]: `${endTimeValidation.validatedHour}:${endTimeValidation.validatedMins}`})
                setPreviousValue({...previousValue, [e.target.name]: endTimeValidation.prevTime}) 
                endTime = `${endTimeValidation.validatedHour}:${endTimeValidation.validatedMins}`
            }
            else{
                setTimeValue({...timeValue, [e.target.name]: endTimeValidation.prevTime})
                setPreviousValue({...previousValue, [e.target.name]: endTimeValidation.prevTime})
                endTime = endTimeValidation.prevTime
            }
        }
        const startTimeArr = splitTime(startTime, ':')
        const endTimeArr = splitTime(endTime, ':')

        const difference = calculateTimeDifference(startTimeArr, endTimeArr)
        const duration = splitTime(props.task.totalTime, ':')
        const seconds = duration[2]

        setInputTime(`${difference.hours}:${difference.minutes}:${stringPadStart(seconds, 2, '0')}`)
        dispatch(updateTask({
            id: props.task.id,
            date: props.task.date,
            startTime: startTime,
            endTime: endTime,
            totalTime: `${difference.hours}:${difference.minutes}:${stringPadStart(seconds, 2, '0')}`
        }))
    }

    const handleDateChange = (dateTime) => {
        const result = inputDateTime(dateTime)
        const date = `${result.year}-${result.month}-${result.date}`
        setDateValue(date)
        dispatch(props.addTodayTask({
            id: props.task.id,
            date: date,
            startTime: timeValue.start,
            endTime: timeValue.end,
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

    const handleDeleteTask = () => {
        dispatch(deleteTask({
            id: props.task.id,
            date: props.task.date
        }))
        setShowActionItems(false)
    }

    const handleDuplicateTask = () => {
        dispatch(props.addTodayTask({
            id: props.uniqueId,
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

    const totalTime = formatTime(elapsedTime)

    const onDurationBlur = (e) => {  
        const input = e.target.value
        const {startTime, endTime, totalTime, isValid} = calculateEndTime(timeValue.start, timeValue.end, input)

        setTimeValue({...timeValue, end: endTime})
        setInputTime(totalTime)
        dispatch(updateTask({
            id: props.task.id,
            date: props.task.date,
            startTime: startTime,
            endTime: endTime,
            totalTime: totalTime        
        }))
    }

    const onTaskNameBlur = (e) => {
        const input = e.target.value
        setTaskName(input)
        dispatch(updateTask({
            id: props.task.id,
            date: props.task.date,
            text: input,       
        }))
    }

    const handleProject = () => {
        console.log('inside')
        return (
            <AddProject
                projectClient={props.projectClient}
                project=''
                client=''
                id={props.task.id}
                isProjectCreated={isProjectCreated}
                setIsProjectCreated={setIsProjectCreated}
                buttonText={isProjectCreated ? `${props.projectClient[props.task.id].project}-${props.projectClient[props.task.id].client}` : "Project"}
            />
        );
    }
    
    return(
        <div className="task-container">
            <input 
                type="text"
                name="task-name"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                onBlur={onTaskNameBlur}
            ></input>
            {/* <p>{props.task.project !== undefined ? (props.task.project + (props.task.client !== undefined ? ' - ' + props.task.client : '')) : (props.task.client !== undefined ? props.task.client : '')}</p> */}
            {/* {console.log(props.task.project, props.task.client, 'tp tc', props.projectClient)} */}

            <button onClick={handleProject}>{isProjectCreated ? `${props.projectClient[props.task.id].project}-${props.projectClient[props.task.id].client}` : "Project" }</button>
            <input 
                type="text" 
                name="start"
                value={timeValue.start}
                onChange={(e) => setTimeValue({...timeValue, [e.target.name]: e.target.value})}
                onBlur={handleBlur}
            ></input>
            <input 
                type="text" 
                name="end"
                value={timeValue.end}
                onChange={(e) =>  setTimeValue({...timeValue, [e.target.name]: e.target.value})}
                onBlur={handleBlur}
            ></input>
            {isRunning && <input disabled className="time" value={totalTime}></input>}
            {!isRunning && <input type='text' className='time' value={inputTime} onChange={(e) => setInputTime(e.target.value)} onBlur={onDurationBlur} />}
            <button className={`${isRunning ? 'hide' : "track-btns start"}`} onClick={handleStart}><i className ="bi bi-play"></i></button>
            <button className={`${!isRunning ? 'hide' : "track-btns stop"}`} onClick={handleStop}><i className="bi bi-pause"></i></button>
            <DatePicker
                selected={dateValue}
                onChange={handleDateChange}
                showTimeSelect={false}
                dateFormat="yyyy-MM-dd"
                customInput={
                    <button>
                        <i className="bi bi-calendar"></i>
                    </button>
                }
            />
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
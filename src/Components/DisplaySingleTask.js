import React, {useState, useEffect, useRef} from "react";
import { useDispatch } from "react-redux";
import { updateTask, deleteTask, updateUniqueId } from "../redux/ClockifySlice";
import DatePicker from "react-datepicker";
import { validateTime } from "../utils/validateTime";
import { calculateTimeDifference } from "../utils/calculateTimeDifference";
import { inputDateTime } from "../utils/inputDateTime";
import { calculateEndTime } from "../utils/calculateEndTime";
import { formatTime } from "../utils/formatTime";
import { AddProject } from "./AddProject";
import "react-datepicker/dist/react-datepicker.css";

export function DisplaySingleTask(props){
    const [isRunning, setIsRunning] = useState(false)
    const [startTime, setStartTime] = useState(null)
    const [elapsedTime, setElapsedTime] = useState(0)
    const [duration, setDuration] = useState(props.task.totalTime)
    const [taskName, setTaskName] = useState(props.task.text)
    
    const currentDateTime = new Date()

    const [date, setDate] = useState(props.task.date)
    const [timeStart, setTimeStart] = useState(props.task.startTime)
    const [timeEnd, setTimeEnd] = useState(props.task.endTime)

    const previousTime = useRef({
        start: timeStart,
        end: timeEnd
    }).current
    const intervalIdRef = useRef(null)

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
        const [hours, minutes, seconds] = duration.split(":").map(Number)
        const durationInMs = (hours * 60 * 60 + minutes * 60 + seconds) * 1000
        setElapsedTime(durationInMs)
        setStartTime(Date.now() - durationInMs)
    }

    const handleStop = () => {
        setDuration(totalTime)
        dispatch(updateTask({
            id:props.task.id,
            date: props.task.date,
            totalTime: totalTime
        }))
        setIsRunning(false)
    }

    const handleStartTimeBlur = (e) => {
        // const validatedStartTime = validateTime(timeStart, date)
        // let startTimeDate 
        // if(validatedStartTime.isValid){
        //     startTimeDate = currentDateTime.setHours(validatedStartTime.validatedHour, validatedStartTime.validatedMins)
        //     setTimeStart(`${currentDateTime.getHours()}:${currentDateTime.getMinutes()}`)
        //     previousTime.start = `${currentDateTime.getHours()}:${currentDateTime.getMinutes()}`
        // }
        // else{
        //     startTimeDate = new Date(`${date} ${previousTime.start}`)
        //     setTimeStart(previousTime.start)
        // }
        // // const endTimeDate = typeof timeEnd === 'undefined' ? new Date(`${date} ${timeEnd}`) : timeEnd
        // const endTimeArr = timeEnd.split(':').map(Number)
        // const endTimeDate = currentDateTime.setHours(endTimeArr[0], endTimeArr[1])

        // console.log(endTimeDate, "end time daate")
        // const timeDurationInMs = Math.abs(endTimeDate - startTimeDate)
        // const totalDuration = formatTime(timeDurationInMs)
        // setDuration(totalDuration)
        // dispatch(updateTask({
        //     id: props.task.id,
        //     date: props.task.date,
        //     startTime: startTimeDate,
        //     endTime: endTimeDate,
        //     totalTime: totalDuration  
        // }))

    }

    const handleEndTimeBlur = (e) => {
        // const validatedEndTime = validateTime(timeEnd, date)

        // let endTimeDate 
        // if(validatedEndTime.isValid){
        //     endTimeDate =new Date(`${date} ${validatedEndTime.validatedHour}:${validatedEndTime.validatedMins}`)
        //     setTimeEnd(`${endTimeDate.getHours()}:${endTimeDate.getMinutes()}`)
        //     previousTime.end = `${endTimeDate.getHours()}:${endTimeDate.getMinutes()}`
        // }
        // else{
        //     endTimeDate =  new Date(`${date} ${previousTime.end}`)
        //     setTimeEnd(previousTime.end)
        // }

        
        // const startTimeDate =  new Date(`${date} ${timeStart}`)
        // const difference = calculateTimeDifference([startTimeDate.getHours(), startTimeDate.getMinutes()], [endTimeDate.getHours(), endTimeDate.getMinutes()])
        // const totalTime = (props.task.totalTime).split(':')
        // setDuration(`${difference.hours}:${difference.minutes}:${totalTime[2]}`)
        // dispatch(updateTask({
        //     id: props.task.id,
        //     date: props.task.date,
        //     startTime: startTimeDate,
        //     endTime: endTimeDate,
        //     totalTime: `${difference.hours}:${difference.minutes}:${totalTime[2]}`  
        // }))
    }

    const handleDateChange = (dateTime) => {
        const result = inputDateTime(dateTime)
        const date = `${result.year}-${result.month}-${result.date}`
        setDate(date)
        dispatch(props.addTodayTask({
            id: props.task.id,
            date: date,
            startTime: props.task.startTime,
            endTime: props.task.endTime,
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

    const handleDurationBlur = (e) => {  
        // const input = e.target.value
        // const {endTime, totalTime} = calculateEndTime(new Date(`${date} ${props.task.startTime}`), input)
        // setTimeEnd(endTime)
        // setDuration(totalTime)
        // dispatch(updateTask({
        //     id: props.task.id,
        //     date: props.task.date,
        //     startTime: new Date(`${date} ${props.task.startTime}`),
        //     endTime: new Date(`${date} ${endTime}`),
        //     totalTime: totalTime        
        // }))
    }

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
                projectClient={props.projectClient}
                project= {props.projectClient[props.task.id]?.project}
                client={props.projectClient[props.task.id]?.client}
                id={props.task.id}
            />
            <input 
                type="text" 
                name="start"
                value={timeStart}
                onChange={(e) => setTimeStart(e.target.value)}
                onBlur={handleStartTimeBlur}
            ></input>
            <input 
                type="text" 
                name="end"
                value={timeEnd}
                onChange={(e) =>  setTimeEnd(e.target.value)}
                onBlur={handleEndTimeBlur}
            ></input>
            {isRunning && <input disabled className="time" value={totalTime}></input>}
            {!isRunning && <input type='text' className='time' value={duration} onChange={(e) => setDuration(e.target.value)} onBlur={handleDurationBlur} />}
            <button className={`${isRunning ? 'hide' : "track-btns start"}`} onClick={handleStart}><i className ="bi bi-play"></i></button>
            <button className={`${!isRunning ? 'hide' : "track-btns stop"}`} onClick={handleStop}><i className="bi bi-pause"></i></button>
            <DatePicker
                selected={date}
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
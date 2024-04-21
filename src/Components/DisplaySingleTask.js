import React, {useState, useEffect, useRef} from "react";
import { useDispatch } from "react-redux";
import { updateTask, deleteTask, updateUniqueId } from "../redux/ClockifySlice";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


export function DisplaySingleTask(props){
    const [isRunning, setIsRunning] = useState(false)
    const [startTime, setStartTime] = useState(null)
    const [elapsedTime, setElapsedTime] = useState(0)
    const [inputTime, setInputTime] = useState(props.task.totalTime)

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

    const formatTime = (timeInMs) => {
        const hours = Math.floor(timeInMs / (1000 * 60 * 60))
        const minutes = Math.floor((timeInMs % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((timeInMs % (1000 * 60)) / 1000)
        
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    } 

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
    let previousMinutes = 0

    const handleBlur = (e) => {
        let {hours, minutes, prevTime} = props.validateTime(e, timeValue, setTimeValue, previousValue, setPreviousValue)
        setTimeValue({
            ...timeValue,
            [e.target.name] :  (hours !== undefined || minutes !== undefined)  ?  (hours + ':' + minutes) : prevTime[e.target.name]
        })
        if(isNaN((e.target.value).replace(':', ''))){
            dispatch(updateTask({
                id: props.task.id,
                date: props.task.date,
                startTime: props.task.startTime,
                endTime: props.task.endTime,
                totalTime: props.task.totalTime
            }))
            return
        }
        const startPart = e.target.name === 'start' ? (hours !== undefined || minutes !== undefined) ? (hours + ':' + minutes) : prevTime[e.target.name] : timeValue.start
        const endPart = e.target.name === 'end' ? ((hours !== undefined || minutes !== undefined) ? (hours + ':' + minutes) : prevTime[e.target.name]) : timeValue.end
      
        const startTimeArr = startPart.split(':').map(Number)
        const endTimeArr = endPart.split(':').map(Number)

        const [hour, minute, seconds] = props.task.totalTime.split(':').map(Number)

        if(startTimeArr[0] > endTimeArr[0] || (startTimeArr[0] === endTimeArr[0] && startTimeArr[1] > endTimeArr[1])){
            const difference = calculateTimeDifference(startPart, endPart)
            const newTime = `${(23 - difference[0]).toString().padStart(2, '0')}:${(difference[1] > 0 ? (60 - difference[1]) : difference[1]).toString().padStart(2,'0')}:${seconds.toString().padStart(2, '0')}`
            setInputTime(newTime)
            dispatch(updateTask({
                id: props.task.id,
                date: props.task.date,
                startTime: startPart,
                endTime: endPart,
                totalTime: newTime
            }))
        }
        else{
          const totalStartTime = startTimeArr[0] * 60 + startTimeArr[1]
          const totalEndTime = endTimeArr[0] * 60 + endTimeArr[1]
        
          const timeDiffMinutes = Math.abs((totalEndTime - totalStartTime))
          const differenceInMinutes = Math.abs(timeDiffMinutes - previousMinutes)
        
          previousMinutes = timeDiffMinutes 
        
          const hoursDiff = Math.floor(differenceInMinutes / 60)
          const minutesDiff = differenceInMinutes % 60
        
          const updatedTotalTime = `${hoursDiff.toString().padStart(2, '0')}:${minutesDiff.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        
          setInputTime(updatedTotalTime)
          dispatch(updateTask({
            id: props.task.id,
            date: props.task.date,
            startTime: startPart,
            endTime: endPart,
            totalTime: updatedTotalTime
          }))
        }
    }

    const handleDateChange = (dateTime) => {
        const day = dateTime.getDate()
        const month = dateTime.getMonth() + 1
        const year = dateTime.getFullYear()
        const date = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
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

    const calculateTimeDifference = (startTime, endTime) => {
        const startTimeArr = startTime.split(':').map(Number)
        const endTimeArr = endTime.split(':').map(Number)
        
        const totalStartTime = startTimeArr[0] * 60 + startTimeArr[1]
        const totalEndTime = endTimeArr[0] * 60 + endTimeArr[1]
        
        const timeDiffMinutes = Math.abs((totalEndTime - totalStartTime))
        const differenceInMinutes = Math.abs(timeDiffMinutes - previousMinutes)
        
        const hoursDiff = Math.floor(differenceInMinutes / 60)
        const minutesDiff = differenceInMinutes % 60
        return [hoursDiff, minutesDiff]
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

    const handleTimerChange = (e) => {
        const input = e.target.value
        let hours, minutes, seconds, timeInput
        let sT = props.task.startTime.split(':').map(Number), eT = props.task.endTime.split(':').map(Number)
        const [hoursPart, minutesPart, secondsPart] = input.split(/:|-/)
        if(input.includes(':') || input.includes('-')){
            hours = hoursPart.padStart(2, '0')
            minutes = minutesPart.padStart(2, '0')
            seconds = secondsPart.padStart(2, '0')
            timeInput = `${hours}:${minutes}:${seconds}`
            setInputTime(timeInput)
        }
        else{
            if(input.length < 7 && !isNaN(input) && parseInt(input) >= 0){
                if(input.length === 1 || input.length === 2){
                   hours = '00'
                   minutes = input.padStart(2, '0')
                   seconds = '00'
                   timeInput = `${hours}:${minutes}:${seconds}`
                   setInputTime(timeInput)
                }
                else if(input.length > 2 && input.length < 6){
                    hours = input.slice(0, -2).padStart(2, '0')
                    minutes = input.slice(-2)
                    seconds = '00'
                    timeInput = `${hours}:${minutes}:${seconds}`
                    setInputTime(timeInput)
                }
                else{
                    dispatch(updateTask({
                        id: props.task.id,
                        date: props.task.date,
                        totalTime: props.task.totalTime           
                    }))
                }
            }
            else{
                dispatch(updateTask({
                    id: props.task.id,
                    date: props.task.date,
                    totalTime: props.task.totalTime           
                }))
            }
        }
        if(sT[0] > eT[0] && sT[1] > eT[1]){
            const difference = calculateTimeDifference(props.task.startTime, props.task.endTime)
            const newTime = `${(24 - difference[0]).toString().padStart(2,'0')}:${difference[1].toString().padStart(2,'0')}:${secondsPart.toString().padStart(2,'0')}`
            dispatch(updateTask({
                id: props.task.id,
                date: props.task.date,
                startTime: props.task.startTime,
                endTime: props.task.endTime,    
                totalTime: newTime            
            }))
        }
        else{
            let newEndTime
            let newHours = sT[0] + parseInt(hours)
            let newMinutes = sT[1] + parseInt(minutes)
            if(!isNaN(newMinutes)){
                if (newMinutes >= 60) {
                    newHours += Math.floor(newMinutes / 60)
                    newMinutes %= 60
                }
                newEndTime = `${(newHours % 24).toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`
            }
            else{
                newEndTime = props.task.endTime
            }
            setTimeValue({...timeValue, end: newEndTime})
            const totalTimeInMs = (parseInt(hours) * 60 * 60 + parseInt(minutes) * 60 + parseInt(seconds)) * 1000
            dispatch(updateTask({
                id: props.task.id,
                date: props.task.date,
                startTime: props.task.startTime,
                endTime: newEndTime,
                totalTime: formatTime(totalTimeInMs)            
            }))
        }
    }
    return(
        <div className="task-container">
            <p>{props.task.text}</p>
            <p>{props.task.project !== undefined ? (props.task.project + (props.task.client !== undefined ? ' - ' + props.task.client : '')) : (props.task.client !== undefined ? props.task.client : '')}</p>
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
            {!isRunning && <input type='text' className='time' value={inputTime} onChange={(e) => setInputTime(e.target.value)} onBlur={handleTimerChange} />}
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
import React, {useState, useRef} from "react";
import { addTodayTask, updateUniqueId } from "../redux/ClockifySlice";
import { useDispatch, useSelector } from 'react-redux';
import { AddProject } from "./AddProject";
import { DisplayTasks } from "./DisplayTasks";
import DatePicker from "react-datepicker";
import { splitTime } from "../utils/splitTime";
import { isStartTimeGreater } from "../utils/isStartTimeGreater";
import { stringPadStart } from "../utils/stringPadStart";
import { inputDateTime } from "../utils/inputDateTime";
import { validateTime } from "../utils/validateTime";
import { convertDateTimeToHoursMinsSec } from "../utils/convertDateTimeToHoursMinsSec";
import "react-datepicker/dist/react-datepicker.css";

export function AddTask(props){
    const {projectClient, totalTasks , uniqueId, isModalOpen} = useSelector(state => state.clockify)
    const currentDateTime = inputDateTime()
    
    const [taskName, setTaskName] = useState('')
    const [dateValue, setDateValue] = useState(`${currentDateTime.year}-${currentDateTime.month}-${currentDateTime.date}`)

    const dateTime = new Date(`${dateValue} ${currentDateTime.hrs}:${currentDateTime.mins}`)
    const time = convertDateTimeToHoursMinsSec(dateTime)
    
    const [startTime, setStartTime] = useState(`${time.hours}:${time.minutes}`)
    const [endTime, setEndTime] = useState(`${time.hours}:${time.minutes}`)

    const [isProjectCreated, setIsProjectCreated] = useState(false)

    const previousTime = useRef({
        start: startTime,
        end: endTime
    }).current

    const dispatch = useDispatch()

    const handleKey = (e) => {
        if(e.key === 'Enter'){
            addTask()
        }
    }

    const handleInputChange = (e) => {
        setTaskName(e.target.value)
    }

    const handleStartTimeChange = (e) => {
        setStartTime(e.target.value)
    }

    const handleEndTimeChange = (e) => {
        setEndTime(e.target.value)
    }

    const handleDateChange = (dateTime) => {
        const inputDate = inputDateTime(dateTime)
        setDateValue(`${inputDate.year}-${inputDate.month}-${inputDate.date}`)
    }

    const handleStartTimeBlur = (e) => {
        const {isValid, validatedHour, validatedMins, prevTime} = validateTime(e.target.value, previousTime.start)
        if(isValid){
            setStartTime(`${validatedHour}:${validatedMins}`)
            previousTime.start = prevTime
        }
        else{
            setStartTime(prevTime)
            previousTime.start = prevTime
        }
    }

    const handleEndTimeBlur = (e) => {
        const {isValid, validatedHour, validatedMins, prevTime} = validateTime(e.target.value, previousTime.end)
        if(isValid){
            setEndTime(`${validatedHour}:${validatedMins}`)
            previousTime.end = prevTime
        }
        else{
            setEndTime(prevTime)
            previousTime.end = prevTime
        }
    }

    const addTask = () => {
        const startTimeArr = splitTime(startTime, ':')
        const endTimeArr = splitTime(endTime, ':')

        const hoursDiff = isStartTimeGreater(startTimeArr, endTimeArr) ? startTimeArr[0] + endTimeArr[0] : Math.abs(startTimeArr[0] - endTimeArr[0])
        const minutesDiff = isStartTimeGreater(startTimeArr, endTimeArr) ? startTimeArr[1] + endTimeArr[1] : Math.abs(startTimeArr[1] - endTimeArr[1])

        if(taskName !== ''){
            dispatch(addTodayTask({
                date: dateValue,
                id: uniqueId,
                text: taskName,
                totalTime: `${stringPadStart(hoursDiff, 2, '0')}:${stringPadStart(minutesDiff, 2, '0')}:00`,
                project: projectClient?.[uniqueId]?.project,
                client: projectClient?.[uniqueId]?.client,
                startTime: startTime,
                endTime: endTime 
            }))
            dispatch(updateUniqueId())
            setTaskName('')
            setIsProjectCreated(false)
            setDateValue(`${currentDateTime.year}-${currentDateTime.month}-${currentDateTime.date}`)
            setStartTime(`${currentDateTime.hrs}:${currentDateTime.mins}`)
            setEndTime(`${currentDateTime.hrs}:${currentDateTime.mins}`)
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
                    addTodayTask={addTodayTask}
                    projectClient={projectClient}
                    id={uniqueId}
                    project=''
                    client=''
                    isProjectCreated={isProjectCreated}
                    setIsProjectCreated={setIsProjectCreated}
                    buttonText="Project"
                />
                <button onClick={addTask}>Add</button>
                <input 
                    type="text" 
                    name="start"
                    value={startTime}
                    onChange={handleStartTimeChange}
                    onBlur={handleStartTimeBlur}
                ></input>
                <input
                    type="text" 
                    name="end"
                    value={endTime}
                    onChange={handleEndTimeChange}
                    onBlur={handleEndTimeBlur}
                ></input>
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
                <p className="ms-2">{dateValue}</p>
            </div>
            <div>
               <DisplayTasks
                isSidebarShrunk = {props.isSidebarShrunk}
                key={uniqueId}
                uniqueId={uniqueId}
                totalTasks={totalTasks}
                currentDate = {`${currentDateTime.year}-${currentDateTime.month}-${currentDateTime.date}`}
                addTodayTask={addTodayTask}
                projectClient={projectClient}
                isModalOpen={isModalOpen}
               /> 
            </div>
        </>
    )
}
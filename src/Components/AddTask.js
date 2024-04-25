import React, {useState} from "react";
import { addTodayTask, updateUniqueId } from "../redux/ClockifySlice";
import { useDispatch, useSelector } from 'react-redux';
import { AddProject } from "./AddProject";
import { DisplayTasks } from "./DisplayTasks";
import DatePicker from "react-datepicker";
import { currentDateTime } from "../utils/currentDateTime";
import { splitTime } from "../utils/splitTime";
import { isStartTimeGreater } from "../utils/isStartTimeGreater";
import { stringPadStart } from "../utils/stringPadStart";
import { inputDateTime } from "../utils/inputDateTime";
import { validateTime } from "../utils/validateTime";
import "react-datepicker/dist/react-datepicker.css";

export function AddTask(props){
    const {projectClient, totalTasks , uniqueId, isModalOpen} = useSelector(state => state.clockify)
    
    const [inputValue, setInputValue] = useState('')
    
    const {curHrs, curMins, curDay, curMonth, curYear} = currentDateTime()
    
    const [dateValue, setDateValue] = useState(`${curYear}-${curMonth}-${curDay}`)
    const [timeValue, setTimeValue] = useState({
        start: `${curHrs}:${curMins}`,
        end: `${curHrs}:${curMins}`
    })
    const [previousValue, setPreviousValue] = useState({
        start: timeValue.start,
        end: timeValue.end
    })

    const [isProjectCreated, setIsProjectCreated] = useState(false)

    const dispatch = useDispatch()

    const handleKey = (e) => {
        if(e.key === 'Enter'){
            addTask()
        }
    }

    const handleInputChange = (e) => {
        setInputValue(e.target.value)
    }

    const handleTimeChange = (e) => {
        setTimeValue({...timeValue, [e.target.name]: e.target.value})
    }

    const handleDateChange = (dateTime) => {
        const inputDate = inputDateTime(dateTime)
        setDateValue(`${inputDate.year}-${inputDate.month}-${inputDate.date}`)
    }

    const handleTimeBlur = (e) => {
        const {isValid, validatedHour, validatedMins, prevTime} = validateTime(e.target.value, previousValue[e.target.name])
        if(isValid){
            setTimeValue({...timeValue, [e.target.name]: `${validatedHour}:${validatedMins}`})
            setPreviousValue({...previousValue, [e.target.name]: prevTime})
        }
        else{
            setTimeValue({...timeValue, [e.target.name]: prevTime})
            setPreviousValue({...previousValue, [e.target.name]: prevTime})
        }
    }
    
    const addTask = () => {
        const startValue = typeof timeValue.start === 'object' ? `${curHrs}:${curMins}` : timeValue.start
        const endValue = typeof timeValue.end === 'object' ? `${curHrs}:${curMins}` : timeValue.end

        const startTimeArr = splitTime(startValue, ':')
        const endTimeArr = splitTime(endValue, ':')

        const hoursDiff = isStartTimeGreater(startTimeArr, endTimeArr) ? startTimeArr[0] + endTimeArr[0] : Math.abs(startTimeArr[0] - endTimeArr[0])
        const minutesDiff = isStartTimeGreater(startTimeArr, endTimeArr) ? startTimeArr[1] + endTimeArr[1] : Math.abs(startTimeArr[1] - endTimeArr[1])

        if(inputValue !== ''){
            dispatch(addTodayTask({
                date: dateValue,
                id: uniqueId,
                text: inputValue,
                totalTime: `${stringPadStart(hoursDiff, 2, '0')}:${stringPadStart(minutesDiff, 2, '0')}:00`,
                project: projectClient?.[uniqueId]?.project,
                client: projectClient?.[uniqueId]?.client,
                startTime: timeValue.start,
                endTime: timeValue.end 
            }))
            dispatch(updateUniqueId())
            setInputValue('')
            setIsProjectCreated(false)
            setDateValue(`${curYear}-${curMonth}-${curDay}`)
            setTimeValue({start: `${curHrs}:${curMins}`, end: `${curHrs}:${curMins}`})
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
                    value={inputValue} 
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
                    value={timeValue.start}
                    onChange={handleTimeChange}
                    onBlur={handleTimeBlur}
                ></input>
                <input
                    type="text" 
                    name="end"
                    value={timeValue.end}
                    onChange={handleTimeChange}
                    onBlur={handleTimeBlur}
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
                currentDate = {`${curYear}-${curMonth}-${curDay}`}
                addTodayTask={addTodayTask}
                projectClient={projectClient}
                isModalOpen={isModalOpen}
               /> 
            </div>
        </>
    )
}
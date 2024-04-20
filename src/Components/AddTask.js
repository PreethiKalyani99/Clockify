import React, {useState} from "react";
import { addTodayTask, updateUniqueId } from "../redux/ClockifySlice";
import { useDispatch, useSelector } from 'react-redux';
import { AddProject } from "./AddProject";
import { DisplayTasks } from "./DisplayTasks";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export function AddTask(){
    const {projectClient, totalTasks , uniqueId} = useSelector(state => state.clockify)
    
    const [inputValue, setInputValue] = useState('')
    
    const currentDateTime = new Date()
    const hrs = currentDateTime.getHours().toString().padStart(2, '0')
    const mins = currentDateTime.getMinutes().toString().padStart(2, '0')
    const day = currentDateTime.getDate()
    const month = currentDateTime.getMonth() + 1
    const year = currentDateTime.getFullYear()
    
    const [dateValue, setDateValue] = useState(`${year}-${month.toString().padStart(2, '0')}-${day}`)
    const [timeValue, setTimeValue] = useState({
        start: `${hrs}:${mins}`,
        end: `${hrs}:${mins}`
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
    const addTask = () => {
        if(inputValue !== ''){
            dispatch(addTodayTask({
                date: dateValue,
                id: uniqueId,
                text: inputValue,
                project: projectClient?.[uniqueId]?.project,
                client: projectClient?.[uniqueId]?.client,
                startTime: timeValue.start,
                endTime: timeValue.end 
            }))
            dispatch(updateUniqueId())
            setInputValue('')
            setIsProjectCreated(false)
            setDateValue(`${year}-${month.toString().padStart(2, '0')}-${day}`)
            setTimeValue({start: `${hrs}:${mins}`, end: `${hrs}:${mins}`})
        }
        else{
            alert('Please enter task description')
        }
    }
    const timeConversion = (num) => {
        let  hours = Math.floor(num / 60)
        let mins = num % 60
        return {hrs: hours, mins: mins}
    }
    
    const handleTimeChange = (e) => {
        setTimeValue({...timeValue, [e.target.name]: e.target.value})
    }
    
    const validateTime = (e, time, setTime, prevTime, setPrevTime) => {
        const name = e.target.name
        let hours, minutes
        let newValue = time[name], expectedLength = 4, firstValue = '', secondvalue = ''
        if(newValue[1] === ':'){
            firstValue = newValue.slice(0, 1)
            secondvalue = newValue.slice(2)

            newValue = firstValue + secondvalue
            expectedLength = 3
        }
        else if(newValue[2] === ':'){
            firstValue = newValue.slice(0, 2)
            secondvalue = newValue.slice(3) 

            newValue = firstValue + secondvalue
            expectedLength = 4
        }
        else if(newValue.length === 3){
            firstValue = newValue.slice(0,1)
            secondvalue = newValue.slice(1)
        }
        else{
            firstValue = newValue.slice(0,2)
            secondvalue = newValue.slice(2,4)
        }

        if(newValue.length <= expectedLength && (!isNaN(newValue)) && parseInt(newValue) >= 0){
            hours = firstValue === '' || firstValue === '24' ? 0 : parseInt(firstValue.padStart(2, '0'))
            minutes = secondvalue === '' ? 0 : parseInt(secondvalue.padStart(2, '0'))

            if(hours < 24 && minutes < 60){
                hours = hours.toString().padStart(2, '0')
                minutes = minutes.toString().padStart(2, '0')
                setTime({...time, [name]: `${hours}:${minutes}`})
                setPrevTime({...prevTime, [name]:  `${hours}:${minutes}`})
            }
            else if(hours > 24 && minutes === 0) {
                const num1 = hours.toString()[0].padStart(2, '0')
                const num2 = hours.toString()[1].padStart(2, '0')
                hours = num1
                minutes = num2
                setTime({...time, [name]: `${num1}:${num2}`})
                setPrevTime({...prevTime, [name]: `${num1}:${num2}`})
            }
            else if(hours < 24 && minutes >= 60){
                let {hrs, mins} = timeConversion(minutes)
                hours += hrs
                hours = (hours % 24).toString().padStart(2, '0')
                minutes = mins.toString().padStart(2, '0')
                setTime({...time, [name]: `${hours}:${minutes}`}) 
                setPrevTime({...prevTime, [name]:  `${hours}:${minutes}`})
            }
            else{
                setTime({...time, [name]: prevTime[name]})
                return {prevTime: prevTime}
            }
        }
        else{
            setTime({...time, [name]: prevTime})
            return {prevTime:prevTime}
        }
        return {hours: hours, minutes: minutes, prevTime: prevTime}
    }

    const handleDateChange = (dateTime) => {
        const day = dateTime.getDate()
        const month = dateTime.getMonth() + 1
        const year = dateTime.getFullYear()
        const date = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
        setDateValue(date)
    }

    return(
        <>
            <div className="add-task-container">
                <input 
                    type="text"
                    placeholder="What are you working on?"
                    className="input-box"
                    onKeyDown={handleKey}
                    value={inputValue} 
                    onChange={handleInputChange}
                ></input>
                <AddProject
                    addTodayTask={addTodayTask}
                    projectClient={projectClient}
                    id={uniqueId}
                    isProjectCreated={isProjectCreated}
                    setIsProjectCreated={setIsProjectCreated}
                />
                <button onClick={addTask}>Add</button>
                <input 
                    type="text" 
                    name="start"
                    value={timeValue.start}
                    onChange={handleTimeChange}
                    onBlur={(e) => validateTime(e, timeValue, setTimeValue, previousValue, setPreviousValue)}
                ></input>
                <input
                    type="text" 
                    name="end"
                    value={timeValue.end}
                    onChange={handleTimeChange}
                    onBlur={(e) => validateTime(e, timeValue, setTimeValue, previousValue, setPreviousValue)}
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
                <p>{dateValue}</p>
            </div>
            <div>
               <DisplayTasks
                key={uniqueId}
                uniqueId={uniqueId}
                totalTasks={totalTasks}
                currentDate = {`${year}-${month.toString().padStart(2, '0')}-${day}`}
                validateTime={validateTime}
                addTodayTask={addTodayTask}
               /> 
            </div>
        </>
    )
}
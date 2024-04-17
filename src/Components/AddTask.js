import React, {useState} from "react";
import { addTodayTask } from "../redux/ClockifySlice";
import { useDispatch, useSelector } from 'react-redux';
import { AddProject } from "./AddProject";
import { DisplayTasks } from "./DisplayTasks";

export function AddTask(){
    const {projectClient, totalTasks} = useSelector(state => state.clockify)
    
    const [inputValue, setInputValue] = useState('')
    
    const currentDateTime = new Date()
    const hrs = currentDateTime.getHours().toString().padStart(2, '0')
    const mins = currentDateTime.getMinutes().toString().padStart(2, '0')
    const day = currentDateTime.getDate()
    const month = currentDateTime.getMonth() + 1
    const year = currentDateTime.getFullYear()
    
    const [dateValue, setDateValue] = useState(`${day}-${month}-${year}`)
    const [timeValue, setTimeValue] = useState({
        start: `${hrs}:${mins}`,
        end: `${hrs}:${mins}`
    })
    let [uniqueId, setUniqueId] = useState(0) 
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
            setUniqueId(uniqueId+1)
            setInputValue('')
            setIsProjectCreated(false)
        }
        else{
            alert('Please enter task description')
        }
    }
    console.log(totalTasks)
    const timeConversion = (num) => {
        let  hours = Math.floor(num / 60)
        let mins = num % 60
        return {hrs: hours, mins: mins}
    }
    
    const handleTimeChange = (e) => {
        setTimeValue({...timeValue, [e.target.name]: e.target.value})
    }
    
    const validateTime = (e) => {
        const name = e.target.name
        let hours, minutes

        if(timeValue[name].length < 6 && !isNaN(parseInt(timeValue[name]))){
            let splitValue = timeValue[name].split(':')
            if(splitValue.length === 1 && (splitValue[0].length === 2 || splitValue[0].length === 3)){
                hours = parseInt(splitValue[0].slice(0,1))
                minutes = parseInt(splitValue[0].slice(1))
            }
            else if(splitValue.length === 1 ){
                hours = splitValue[0].slice(0,2) === '' ? '00' : parseInt(splitValue[0].slice(0,2))
                minutes = splitValue[0].slice(2,4) === '' ? '00' : parseInt(splitValue[0].slice(2,4))
            }
            else{
                hours = splitValue[0] === '' ? '00' : parseInt(splitValue[0])
                minutes = splitValue[1] === '' ? '00' : parseInt(splitValue[1])                
            }
            
            if(hours < 24 && minutes < 60){
                setTimeValue({...timeValue, [name]: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`})
            }
            else if(hours > 23){
                setTimeValue({...timeValue, [name]: `${hrs}:${mins}`})
            }
            else if(minutes > 60){
                let {hrs, mins} = timeConversion(minutes)
                hours += hrs
                hours = hours % 24
                minutes = mins
                setTimeValue({...timeValue, [name]: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`}) 
            }
        }
        else{
            setTimeValue({...timeValue, [name]: `${hrs}:${mins}`})
        }
    }

    const handleDateChange = (e) => {
        setDateValue(e.target.value)
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
                    onBlur={validateTime}
                ></input>
                <input
                    type="text" 
                    name="end"
                    value={timeValue.end}
                    onChange={handleTimeChange}
                    onBlur={validateTime}
                ></input>
                <input type="date" name="date" value={dateValue} onChange={handleDateChange}></input>
            </div>
            <div>
               <DisplayTasks
                key={uniqueId}
                totalTasks={totalTasks}
               /> 
            </div>
        </>
    )
}
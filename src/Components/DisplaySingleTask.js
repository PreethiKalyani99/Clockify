import React, {useState} from "react";
import { useDispatch } from "react-redux";
import { updateTask, deleteTask, updateUniqueId } from "../redux/ClockifySlice";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


export function DisplaySingleTask(props){
    const [timeValue, setTimeValue] = useState({
        start: props.task.startTime.toString(),
        end: props.task.endTime.toString()
    })
    const [previousValue, setPreviousValue] = useState({
        start: timeValue.start,
        end: timeValue.end
    })
    const currentDateTime = new Date()
    const day = currentDateTime.getDate()
    const month = currentDateTime.getMonth() + 1
    const year = currentDateTime.getFullYear()
    const [dateValue, setDateValue] = useState(`${year}-${month.toString().padStart(2, '0')}-${day}`)
    const [showActionItems, setShowActionItems] = useState(false)
    const dispatch = useDispatch()

    const handleBlur = (e) => {
        let {hours, minutes, prevTime} = props.validateTime(e, timeValue, setTimeValue, previousValue, setPreviousValue)
        setTimeValue({
            ...timeValue,
            [e.target.name] :  (hours !== undefined || minutes !== undefined)  ?  (hours + ':' + minutes) : prevTime[e.target.name]
        })
        dispatch(updateTask({
            id: props.task.id,
            date: props.task.date,
            startTime: e.target.name === 'start' ? (hours !== undefined || minutes !== undefined)  ?  (hours + ':' + minutes) : prevTime[e.target.name] : timeValue.start,
            endTime: e.target.name === 'end' ?  ((hours !== undefined || minutes !== undefined)  ?  (hours + ':' + minutes) : prevTime[e.target.name]) : timeValue.end
        }))
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
            client: props.task.client
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
            client: props.task.client
        }))
        dispatch(updateUniqueId())
        setShowActionItems(false)
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
import React, {useState} from "react";
import { useDispatch } from "react-redux";
import { updateTask, deleteTask, updateUniqueId } from "../redux/ClockifySlice";

export function DisplaySingleTask(props){
    const [timeValue, setTimeValue] = useState({
        start: props.task.startTime.toString(),
        end: props.task.endTime.toString()
    })
    const [previousValue, setPreviousValue] = useState({
        start: timeValue.start,
        end: timeValue.end
    })
    const [totalTime, setTotalTime] = useState()
    const [dateValue, setDateValue] = useState(props.task.date)
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
           date: dateValue,
           startTime: e.target.name === 'start' ? (hours !== undefined || minutes !== undefined)  ?  (hours + ':' + minutes) : prevTime[e.target.name] : timeValue.start,
           endTime: e.target.name === 'end' ?  ((hours !== undefined || minutes !== undefined)  ?  (hours + ':' + minutes) : prevTime[e.target.name]) : timeValue.end
        }))
    }

    const handleDateChange = (e) => {
        const newDate = e.target.value
        setDateValue(newDate)
        console.log(props.task.id, 'id', props.task.text)
        dispatch(props.addTodayTask({
            id: props.task.id,
            date: newDate,
            startTime: timeValue.start,
            endTime: timeValue.end,
            text: props.task.text
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
            text: props.task.text
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
            <input
                type="date"
                onChange={handleDateChange}
                value={props.task.date}
            ></input>
            <input
                type="text"
                name="time"
                value={totalTime}
                onChange={(e) => setTotalTime(e.target.value)}
                // onBlur={handleTotalTime}
            ></input>
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
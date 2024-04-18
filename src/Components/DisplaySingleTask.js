import React, {useState} from "react";
import { useDispatch } from "react-redux";
import { updateTask } from "../redux/ClockifySlice";

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
    return(
        <>
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
                type="text"
                name="time"
                value={totalTime}
                onChange={(e) => setTotalTime(e.target.value)}
                // onBlur={handleTotalTime}
            ></input>
        </>
    )
}
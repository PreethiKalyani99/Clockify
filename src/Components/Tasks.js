import React, {useEffect} from "react";
import { useDispatch } from "react-redux";
import { Task } from "./Task";
import { deleteTask, updateTask } from "../redux/ClockifySlice";

export function Tasks(props){
    const dispatch = useDispatch()
    function formatDate(dateString) {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    }

    function handleTaskNameBlur(taskDescription, id){
        const updateTaskName = props.tasks.find(task => task.id === id)
        dispatch(updateTask({...updateTaskName, text: taskDescription}))
    }

    function handleStartTimeBlur(e, id){
        const updateStartTime = props.tasks.find(task => task.id === id)

        const {isValid, validatedHour, validatedMins} = props.convertToHoursAndMinutes(e.target.value)
        const newStart = new Date(updateStartTime.startTime)
        newStart.setHours(validatedHour, validatedMins)

        if (!isValid || props.isDurationLimitExceeded(newStart, updateStartTime.endTime)) {
            dispatch(updateTask(updateStartTime))
            return
        }
        dispatch(updateTask({...updateStartTime, startTime: newStart.toString()}))
    }

    function handleEndTimeBlur(e, id){
        const updateEndTime = props.tasks.find(task => task.id === id)

        const {isValid, validatedHour, validatedMins} = props.convertToHoursAndMinutes(e.target.value)
        const newEnd = new Date(updateEndTime.endTime)
        newEnd.setHours(validatedHour, validatedMins)

        if(!isValid || props.isDurationLimitExceeded(updateEndTime.startTime, newEnd)) {
            dispatch(updateTask(updateEndTime))
            return
        }

        dispatch(updateTask({...updateEndTime, endTime: newEnd.toString()}))
    }

    function handleDurationBlur(e, id){
        const updateDuration = props.tasks.find(task => task.id === id)

        const {isValid, newEndTime, timeDuration} = props.calculateEndTime(updateDuration.startTime, e.target.value)
        if(isValid){
            dispatch(updateTask({...updateDuration, endTime: newEndTime.toString(), totalTime: timeDuration}))
        }
    }

    function handleDateChange(dateTime, id){
        const updateDate = props.tasks.find(task => task.id === id)
        
        const newEndTime = props.calculateEndDate(dateTime, new Date(updateDate.endTime), new Date(updateDate.startTime))
        dispatch(updateTask({...updateDate, startTime: dateTime.toString(), endTime: newEndTime.toString()}))
    }

    function handleDuplicateTask(id){
        const duplicateTask = props.tasks.find(task => task.id === id)

        dispatch(props.addTodayTask({...duplicateTask, id: props.uniqueId}))
    }

    function handleDeleteTask(id){
        dispatch(deleteTask({id}))
    }
    return(
        <div className="parent-container mt-5" >
            {props.tasks.length > 0 && <div className="display-container">
                <div> {props.tasks.map((task, index) => (
                    <div className={(props.tasks.length > 0 && props.tasks.length-1 !== index) ? props.isSidebarShrunk ? "sub-container border-style expand-width" : "sub-container border-style shrink-width" : "sub-container"} key={index}>
                        <Task
                            key={index}
                            task={task}
                            timeStart={props.timeStart}
                            timeEnd={props.timeEnd}
                            projectClient={props.projectClient}
                            uniqueId={props.uniqueId}
                            onTaskBlur={handleTaskNameBlur}
                            onStartBlur={handleStartTimeBlur}
                            onEndBlur={handleEndTimeBlur}
                            onDurationBlur={handleDurationBlur}
                            onDateChange={handleDateChange}
                            onDuplicate={handleDuplicateTask}
                            onDelete={handleDeleteTask}
                            toggleAction={props.toggleAction}
                            showActionItems={props.showActionItems}
                        />
                    </div>
                ))}
                </div>
            </div>}
        </div>
    )
}

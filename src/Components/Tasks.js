import React from "react";
import { useDispatch } from "react-redux";
import { Task } from "./Task";
import { deleteTask, updateTask } from "../redux/ClockifySlice";
import { getTaskById } from "../utils/getTaskById";
import { convertToHoursAndMinutes } from "../utils/convertToHoursAndMinutes";
import { isDurationLimitExceeded } from "../utils/isDurationLimitExceeded";
import { calculateEndDate } from "../utils/calculateEndDate";
import { calculateEndTime } from "../utils/calculateEndTime";

export function Tasks({isSidebarShrunk, tasks, addTodayTask, projectClient, timeStart, timeEnd, uniqueId}){
    const dispatch = useDispatch()

    function formatDate(dateString) {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    }

    function handleTaskNameBlur(taskDescription, id){
        const task = getTaskById(tasks, id)
        dispatch(updateTask({...task, text: taskDescription}))
    }

    function handleStartTimeBlur(e, id){
        const task = getTaskById(tasks, id)
        const {isValid, validatedHour, validatedMins} = convertToHoursAndMinutes(e.target.value)
        const newStart = new Date(task.startTime)
        newStart.setHours(validatedHour, validatedMins)

        if (!isValid || isDurationLimitExceeded(newStart, task.endTime)) {
            dispatch(updateTask(task))
            return
        }
        dispatch(updateTask({...task, startTime: newStart.toString()}))
    }

    function handleEndTimeBlur(e, id){
        const task = getTaskById(tasks, id)
        const {isValid, validatedHour, validatedMins} = convertToHoursAndMinutes(e.target.value)
        const newEnd = new Date(task.endTime)
        newEnd.setHours(validatedHour, validatedMins)

        if(!isValid || isDurationLimitExceeded(task.startTime, newEnd)) {
            dispatch(updateTask(task))
            return
        }

        dispatch(updateTask({...task, endTime: newEnd.toString()}))
    }

    function handleDurationBlur(e, id){
        const task = getTaskById(tasks, id)

        const {isValid, newEndTime, timeDuration} = calculateEndTime(task.startTime, e.target.value)
        if(isValid){
            dispatch(updateTask({...task, endTime: newEndTime.toString(), totalTime: timeDuration}))
        }
    }

    function handleDateChange(dateTime, id){
        const task = getTaskById(tasks, id)
        
        const newEndTime = calculateEndDate(dateTime, new Date(task.endTime), new Date(task.startTime))
        dispatch(updateTask({...task, startTime: dateTime.toString(), endTime: newEndTime.toString()}))
    }

    function handleDuplicateTask(id){
        const task = getTaskById(tasks, id)

        dispatch(addTodayTask({...task, id: uniqueId}))
    }

    function handleDeleteTask(id){
        dispatch(deleteTask({id}))
    }
    return(
        <div className="parent-container mt-5" >
            {tasks.length > 0 && <div className="display-container">
                <div> {tasks.map((task, index) => (
                    <div className={(tasks.length > 0 && tasks.length-1 !== index) ? isSidebarShrunk ? "sub-container border-style expand-width" : "sub-container border-style shrink-width" : "sub-container"} key={index}>
                        <Task
                            key={index}
                            task={task}
                            timeStart={timeStart}
                            timeEnd={timeEnd}
                            projectClient={projectClient}
                            onTaskBlur={handleTaskNameBlur}
                            onStartBlur={handleStartTimeBlur}
                            onEndBlur={handleEndTimeBlur}
                            onDurationBlur={handleDurationBlur}
                            onDateChange={handleDateChange}
                            onDuplicate={handleDuplicateTask}
                            onDelete={handleDeleteTask}
                        />
                    </div>
                ))}
                </div>
            </div>}
        </div>
    )
}

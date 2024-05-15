import React from "react";
import { useDispatch } from "react-redux";
import { Task } from "./Task";
import { deleteTask, updateTask, addProjectClient, updateUniqueId } from "../redux/ClockifySlice";
import { getTaskById } from "../utils/getTaskById";
import { convertToHoursAndMinutes } from "../utils/convertToHoursAndMinutes";
import { isDurationLimitExceeded } from "../utils/isDurationLimitExceeded";
import { calculateEndDate } from "../utils/calculateEndDate";
import { calculateEndTime } from "../utils/calculateEndTime";
import { groupTasksByWeek } from "../utils/groupTasksByWeek";

export function Tasks({isSidebarShrunk, tasks, addTodayTask, projectClient, timeStart, timeEnd, uniqueId}){
    const dispatch = useDispatch()

    const tasksByWeek = groupTasksByWeek({ tasks })

    function formatDate(dateString) {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    }

    function handleTaskNameBlur(taskDescription, id){
        dispatch(updateTask({id, text: taskDescription}))
    }

    function handleStartTimeBlur(e, id){
        const task = getTaskById(tasks, id)
        const {isValid, validatedHour, validatedMins} = convertToHoursAndMinutes(e.target.value)
        const newStart = new Date(task.startTime)
        newStart.setHours(validatedHour, validatedMins)

        if (!isValid || isDurationLimitExceeded(newStart, task.endTime)) {
            dispatch(updateTask(id, task))
            return
        }
        dispatch(updateTask({id, startTime: newStart.toString()}))
    }

    function handleEndTimeBlur(e, id){
        const task = getTaskById(tasks, id)
        const {isValid, validatedHour, validatedMins} = convertToHoursAndMinutes(e.target.value)
        const newEnd = new Date(task.endTime)
        newEnd.setHours(validatedHour, validatedMins)

        if(!isValid || isDurationLimitExceeded(task.startTime, newEnd)) {
            dispatch(updateTask(id, task))
            return
        }

        dispatch(updateTask({id, endTime: newEnd.toString()}))
    }

    function handleDurationBlur(e, id){
        const task = getTaskById(tasks, id)

        const {isValid, newEndTime, timeDuration} = calculateEndTime(task.startTime, e.target.value)
        if(isValid){
            dispatch(updateTask({id, endTime: newEndTime.toString(), totalTime: timeDuration}))
        }
    }

    function handleDateChange(dateTime, id){
        const task = getTaskById(tasks, id)
        
        const newEndTime = calculateEndDate(dateTime, new Date(task.endTime), new Date(task.startTime))
        dispatch(updateTask({id, startTime: dateTime.toString(), endTime: newEndTime.toString()}))
    }

    function handleDuplicateTask(id){
        const task = getTaskById(tasks, id)
        dispatch(addProjectClient({id: uniqueId, project: task.project.projectName, client: task.project.client}))
        dispatch(addTodayTask({...task, id: uniqueId}))
        dispatch(updateUniqueId())
    }

    function handleDeleteTask(id){
        dispatch(deleteTask({id}))
    }
    return(
        <div className="parent-container" >
           {Object.entries(tasksByWeek).map(([range, total_tasks]) => {
             const result = range.split(' to ').map(date => formatDate(date))
             return (<div key={range} className="mt-3">
                <p><b>{result.join(' - ')}</b></p>
                {Object.entries(total_tasks).map(([key, tasks]) => (
                    <div className="week-container mb-3" key={key}>
                        <p>{new Date(key).toLocaleDateString('en-US', {month: 'long', day: 'numeric', year: 'numeric'})}</p>
                        {tasks.length > 0 && <div className="display-container" key={key}>
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
                ))}
            </div>)
        })}
        </div>
    )
}

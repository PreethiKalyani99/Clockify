import React from "react";
import { useDispatch } from "react-redux";
import { Task } from "./Task";
import { updateUniqueId } from "../redux/ClockifySlice";
import { updateTimeEntry, deleteTimeEntry, duplicateTimeEntry } from "../redux/clockifyThunk";
import { getTaskById } from "../utils/getTaskById";
import { convertToHoursAndMinutes } from "../utils/convertToHoursAndMinutes";
import { isDurationLimitExceeded } from "../utils/isDurationLimitExceeded";
import { calculateEndDate } from "../utils/calculateEndDate";
import { calculateEndTime } from "../utils/calculateEndTime";
import { groupTasksByWeek } from "../utils/groupTasksByWeek";
import { addTotalTime } from "../utils/addTotalTime";

export function Tasks({isSidebarShrunk, data, projectClient, timeStart, timeEnd, uniqueId, isTimerOn, toggleTimer}){
    const dispatch = useDispatch()

    const tasksByWeek = groupTasksByWeek(data)

    function formatDate(dateString) {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    }

    function handleTaskNameBlur(taskDescription, id){
        const task = getTaskById(data, id)
        dispatch(updateTimeEntry({start: task.timeInterval.start, end: task.timeInterval.end, description: taskDescription, id: id}))
    }

    function handleStartTimeBlur(e, id, endTime){
        const task = getTaskById(data, id)
        
        const {isValid, validatedHour, validatedMins} = convertToHoursAndMinutes(e.target.value)
        const newStart = new Date(task.timeInterval.start)
        newStart.setHours(validatedHour, validatedMins)

        if (!isValid || isDurationLimitExceeded(newStart, new Date(task.timeInterval.end))) {
            dispatch(updateTimeEntry({task, id}))
            return
        }
        console.log(new Date(endTime), "start Blur end time")
        dispatch(updateTimeEntry({description: task.description, start: newStart.toISOString().split('.')[0] + 'Z', end: task.timeInterval.end, id: id}))
    }

    function handleEndTimeBlur(e, id, startTime){
        const task = getTaskById(data, id)
        const {isValid, validatedHour, validatedMins} = convertToHoursAndMinutes(e.target.value)
        const newEnd = new Date(task.timeInterval.end)
        newEnd.setHours(validatedHour, validatedMins)

        console.log(new Date(startTime), "end blur start time")
        if(!isValid || isDurationLimitExceeded(new Date(task.timeInterval.start), newEnd)) {
            dispatch(updateTimeEntry({task, id: id}))
            return
        }

        dispatch(updateTimeEntry({description: task.description, start: task.timeInterval.start, end: newEnd.toISOString().split('.')[0] + 'Z', id: id}))
    }

    function handleDurationBlur(e, id){
        const task = getTaskById(data, id)

        const {isValid, newEndTime} = calculateEndTime(new Date(task.timeInterval.start), e.target.value)
        if(isValid){
            dispatch(updateTimeEntry({description: task.description, start: task.timeInterval.start, end: newEndTime.toISOString().split('.')[0] + 'Z', id: id}))
        }
    }

    function handleDateChange(dateTime, id){
        const task = getTaskById(data, id)
        
        const newEndTime = calculateEndDate(dateTime, new Date(task.timeInterval.end), new Date(task.timeInterval.start))
        dispatch(updateTimeEntry({description: task.description, start: dateTime.toISOString().split('.')[0] + 'Z', end: newEndTime.toISOString().split('.')[0] + 'Z', id: id}))
    }

    function handleDuplicateTask(id){
        // const task = getTaskById(data, id)
        // dispatch(addProjectClient({id: uniqueId, project: task.project.projectName, client: task.project.client}))
        dispatch(duplicateTimeEntry({id}))
        dispatch(updateUniqueId())
    }

    function handleDeleteTask(id){
        dispatch(deleteTimeEntry({id}))
    }
    return(
        <div className="parent-container" >
           {Object.entries(tasksByWeek).map(([range, total_tasks]) => {
             const result = range.split(' to ').map(date => formatDate(date))
             const weekTasks = Object.values(total_tasks).flat(1)
             return (<div key={range} className="mt-3">
                <p><b>{result.join(' - ')}</b></p>
                <p>Week total: {addTotalTime(weekTasks)}</p>
                {Object.entries(total_tasks).map(([key, tasks]) => (
                    <div className="week-container mb-3" key={key}>
                        <p>{new Date(key).toLocaleDateString('en-US', {month: 'long', day: 'numeric', year: 'numeric'})}</p>
                        <p>Total: {addTotalTime(tasks)}</p>
                        {tasks.length > 0 && <div className="display-container" key={key}>
                            <div> {tasks.map((task, index) => (
                                <div className={(tasks.length > 0 && tasks.length-1 !== index) ? isSidebarShrunk ? "sub-container border-style expand-width" : "sub-container border-style shrink-width" : "sub-container"} key={index}>
                                    <Task
                                        key={index}
                                        task={task}
                                        timeStart={timeStart}
                                        timeEnd={timeEnd}
                                        uniqueId={uniqueId}
                                        projectClient={projectClient}
                                        isTimerOn={isTimerOn}
                                        toggleTimer={toggleTimer}
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

import React from "react";
import { useDispatch } from "react-redux";
import { Task } from "./Task";
import { updateUniqueId } from "../redux/ClockifySlice";
import { deleteTimeEntry, duplicateTimeEntry, updateTimeEntry } from "../redux/clockifyThunk";
import { getTaskById } from "../utils/getTaskById";
import { convertToHoursAndMinutes } from "../utils/convertToHoursAndMinutes";
import { isDurationLimitExceeded } from "../utils/isDurationLimitExceeded";
import { calculateEndDate } from "../utils/calculateEndDate";
import { calculateEndTime } from "../utils/calculateEndTime";
import { groupTasksByWeek } from "../utils/groupTasksByWeek";
import { addTotalTime } from "../utils/addTotalTime";
import { formatDate } from "../utils/formatTime";

export function Tasks({ data, projects, clients, projectClient, timeStart, timeEnd, uniqueId, isTimerOn, toggleTimer}){
    const dispatch = useDispatch()

    const tasksByWeek = groupTasksByWeek(data)

    function handleTaskNameBlur(taskDescription, id){
        const task = getTaskById(data, id)
        dispatch(updateTimeEntry({start: task.timeInterval.start, end: task.timeInterval.end, description: taskDescription, id: id,  projectId: task.projectId}))
    }

    function handleStartTimeBlur(e, id, endTime){
        const task = getTaskById(data, id)
        const {isValid, validatedHour, validatedMins} = convertToHoursAndMinutes(e.target.value)
        const timeEnd = new Date(endTime)

        const newStart = new Date(task.timeInterval.start)
        newStart.setHours(validatedHour, validatedMins)

        if (!isValid || isDurationLimitExceeded(newStart, new Date(task.timeInterval.end))) {
            dispatch(updateTimeEntry({task, id}))
            return
        }
        if(newStart > timeEnd){
            timeEnd.setDate(timeEnd.getDate() + 1)
        }
        dispatch(updateTimeEntry({description: task.description, start: newStart.toISOString().split('.')[0] + 'Z', end: timeEnd.toISOString().split('.')[0] + 'Z', id: id, projectId: task.projectId}))
    }

    function handleEndTimeBlur(e, id, startTime){
        const task = getTaskById(data, id)
        const {isValid, validatedHour, validatedMins} = convertToHoursAndMinutes(e.target.value)
        const timeStart = new Date(startTime)

        const newEnd = new Date(task.timeInterval.end)
        newEnd.setHours(validatedHour, validatedMins)

        if(!isValid || isDurationLimitExceeded(new Date(task.timeInterval.start), newEnd)) {
            dispatch(updateTimeEntry({task, id: id}))
            return
        }
        if(timeStart > newEnd){
            newEnd.setDate(newEnd.getDate() + 1)
        }
        dispatch(updateTimeEntry({description: task.description, start: task.timeInterval.start, end: newEnd.toISOString().split('.')[0] + 'Z', id: id, projectId: task.projectId}))
    }

    function handleDurationBlur(e, id){
        const task = getTaskById(data, id)

        const {isValid, newEndTime} = calculateEndTime(new Date(task.timeInterval.start), e.target.value)
        if(isValid){
            dispatch(updateTimeEntry({description: task.description, start: task.timeInterval.start, end: newEndTime.toISOString().split('.')[0] + 'Z', id: id, projectId: task.projectId}))
        }
    }

    function handleDateChange(dateTime, id){
        const task = getTaskById(data, id)

        const newEndTime = calculateEndDate(dateTime, new Date(task.timeInterval.end), new Date(task.timeInterval.start))
        dispatch(updateTimeEntry({description: task.description, start: dateTime.toISOString().split('.')[0] + 'Z', end: newEndTime.toISOString().split('.')[0] + 'Z', id: id, projectId: task.projectId}))
    }

    function handleDuplicateTask(id){
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
                <div className="week-total-container">
                    <p><b>{result.join(' - ')}</b></p>
                    <p className="week-total-text">Week total: <span className="week-total ms-2">{addTotalTime(weekTasks)}</span></p>
                </div>
                {Object.entries(total_tasks).map(([key, tasks]) => (
                    <div className="week-container mb-3" key={key}>
                        <div className="total-time-container">
                            <p>{new Date(key).toLocaleDateString('en-US', {month: 'long', day: 'numeric', year: 'numeric'})}</p>
                            <p className="total-text">Total: <span className="total-time ms-2">{addTotalTime(tasks)}</span></p>
                        </div>
                        {tasks.length > 0 && <div className="display-container" key={key}>
                            <div className="display-container-style"> {tasks.map((task, index) => (
                                    <div className={(tasks.length > 0 && tasks.length-1 !== index) ? "task-sub-container border-style" : "task-sub-container"} key={index}>
                                        <Task
                                            key={index}
                                            task={task}
                                            data={data}
                                            projects={projects}
                                            clients={clients}
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

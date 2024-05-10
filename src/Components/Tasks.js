import React from "react";
import { Task } from "./Task";

export function Tasks(props){
    let tasksByWeek = {}

    Object.entries(props.tasks).forEach(([key, task]) => {
        task.forEach(task => {
            let taskDate = new Date(task.date)

            let taskDay = taskDate.getDate()
            let taskYear = taskDate.getFullYear()
            let taskMonth = taskDate.getMonth() + 1

            let first = taskDate.getDate() - taskDate.getDay()
            let last = first + 6

            let firstday = new Date(taskDate.setDate(first))
            let lastday = new Date(taskDate.setDate(last))

            let startDate = firstday.getDate() //
            let startMonth = firstday.getMonth() + 1
            let startYear = firstday.getFullYear()

            let endDate = lastday.getDate()
            let endMonth = lastday.getMonth() + 1 //
            let endYear = lastday.getFullYear() //

            if((endMonth === 12 && taskMonth < endMonth) || (taskDay < startDate && taskMonth > endMonth)){
                endMonth = taskMonth
                if(taskYear > endYear){
                    endYear += 1
                }
            }
            else{
                endYear = lastday.getFullYear()
                endMonth = lastday.getMonth() + 1
            }

            let weekRange = `${startYear}-${startMonth}-${startDate} to ${endYear}-${endMonth}-${endDate}`

            let found = false
            for (const range in tasksByWeek) {
                let [start, end] = range.split(' to ').map(dateStr => new Date(dateStr))
                if (taskDate >= start && taskDate <= end) {
                    if (!tasksByWeek[range][task.date]) {
                        tasksByWeek[range][task.date] = []
                    }
                    tasksByWeek[range][task.date].push(task)
                    found = true
                    break
                }
            }

            if (!found) {
                if (!tasksByWeek[weekRange]) {
                    tasksByWeek[weekRange] = {}
                }

                if (!tasksByWeek[weekRange][task.date]) {
                    tasksByWeek[weekRange][task.date] = []
                }
                tasksByWeek[weekRange][task.date].push(task)
            }
        })
    })

    function formatDate(dateString) {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
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
                                <div className={(tasks.length > 0 && tasks.length-1 !== index) ? props.isSidebarShrunk ? "sub-container border-style expand-width" : "sub-container border-style shrink-width" : "sub-container"} key={index}>
                                    <Task
                                        key={index}
                                        task={task}
                                        tasks={props.tasks}
                                        timeStart={props.timeStart}
                                        timeEnd={props.timeEnd}
                                        projectClient={props.projectClient}
                                        uniqueId={props.uniqueId}
                                        onTaskBlur={props.onTaskBlur}
                                        onStartBlur={props.onStartBlur}
                                        onEndBlur={props.onEndBlur}
                                        onDurationBlur={props.onDurationBlur}
                                        onDateChange={props.onDateChange}
                                        toggleAction={props.toggleAction}
                                        showActionItems={props.showActionItems}
                                        duration={props.duration}
                                        taskName={props.taskName}
                                        updateDurationRef={props.updateDurationRef}
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

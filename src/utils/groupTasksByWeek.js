import { getFormattedDate } from "./getFormattedDate"

export function splitToDateComponents(taskDate) {
    const date = taskDate.getDate()
    const year = taskDate.getFullYear()
    const month = taskDate.getMonth() + 1
    return {date, year, month};
}

export function groupTasksByWeek(tasks){
    let tasksByWeek = {}
    tasks && tasks.forEach(task => {
        const date = getFormattedDate(new Date(task.timeInterval.start))
        let taskDate = new Date(task.timeInterval.start)

        const { date: taskStartDate, year: taskYear, month: taskMonth} = splitToDateComponents(taskDate);

        let first = taskDate.getDate() - taskDate.getDay()
        let last = first + 6

        const { date: weekStartDate, year: weekStartYear, month: weekStartMonth} = splitToDateComponents(new Date(taskDate.setDate(first)));

        let { date: weekEndDate, year: weekEndYear, month: weekEndMonth} = splitToDateComponents(new Date(taskDate.setDate(last)));

        if((weekEndMonth === 12 && taskMonth < weekEndMonth) || (taskStartDate < weekStartDate && taskMonth > weekEndMonth)){
            if(taskYear > weekEndYear){
                weekEndMonth = taskMonth
                weekEndYear += 1
            }
        }
        else{
            weekEndYear = new Date(taskDate.setDate(last)).getFullYear()
            weekEndMonth = new Date(taskDate.setDate(last)).getMonth() + 1
        }

        let weekRange = `${weekStartYear}-${weekStartMonth}-${weekStartDate} to ${weekEndYear}-${weekEndMonth}-${weekEndDate}`

        let found = false
        for (const range in tasksByWeek) {
            let [start, end] = range.split(' to ').map(dateStr => new Date(dateStr))
            if (taskDate >= start && taskDate <= end) {
                if (!tasksByWeek[range][date]) {
                    tasksByWeek[range][date] = []
                }
                tasksByWeek[range][date].push(task)
                found = true
                break
            }
        }

        if (!found) {
            if (!tasksByWeek[weekRange]) {
                tasksByWeek[weekRange] = {}
            }

            if (!tasksByWeek[weekRange][date]) {
                tasksByWeek[weekRange][date] = []
            }
            tasksByWeek[weekRange][date].push(task)
        }
    })

    return tasksByWeek
}

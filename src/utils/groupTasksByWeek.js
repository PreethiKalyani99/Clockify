import { getFormattedDate } from "./getFormattedDate"

export function groupTasksByWeek(tasks){
    let tasksByWeek = {}
    tasks && tasks.forEach(task => {
        const date = getFormattedDate(new Date(task.timeInterval.start))
        let taskDate = new Date(task.timeInterval.start)

        let taskDay = taskDate.getDate()
        let taskYear = taskDate.getFullYear()
        let taskMonth = taskDate.getMonth() + 1

        let first = taskDate.getDate() - taskDate.getDay()
        let last = first + 6

        let weekStartDate = new Date(taskDate.setDate(first))
        let weekEndDate = new Date(taskDate.setDate(last))

        let startDate = weekStartDate.getDate() 
        let startMonth = weekStartDate.getMonth() + 1
        let startYear = weekStartDate.getFullYear()

        let endDate = weekEndDate.getDate()
        let endMonth = weekEndDate.getMonth() + 1 
        let endYear = weekEndDate.getFullYear() 

        if((endMonth === 12 && taskMonth < endMonth) || (taskDay < startDate && taskMonth > endMonth)){
            endMonth = taskMonth
            if(taskYear > endYear){
                endYear += 1
            }
        }
        else{
            endYear = weekEndDate.getFullYear()
            endMonth = weekEndDate.getMonth() + 1
        }

        let weekRange = `${startYear}-${startMonth}-${startDate} to ${endYear}-${endMonth}-${endDate}`

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
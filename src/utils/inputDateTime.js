import { stringPadStart } from "./stringPadStart"
export function inputDateTime(dateString){
    const time = typeof dateString === 'undefined' ? new Date() : new Date(dateString)
    const hrs = stringPadStart(time.getHours(), 2, '0')
    const mins = stringPadStart(time.getMinutes(), 2, '0')
    const day = time.getDay()
    const date = stringPadStart(time.getDate(), 2, '0')
    const month = stringPadStart(time.getMonth() + 1, 2, '0')
    const year = time.getFullYear()

    return {day: day, date:date, month: month, year: year, hrs: hrs, mins: mins, time: time}
}
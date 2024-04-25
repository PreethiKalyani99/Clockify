import { stringPadStart } from "./stringPadStart"

export function currentDateTime(){
    const currentDateTime = new Date()
    const hrs = stringPadStart(currentDateTime.getHours(), 2, '0')
    const mins = stringPadStart(currentDateTime.getMinutes(), 2, '0')
    const day = stringPadStart(currentDateTime.getDate(), 2, '0')
    const month = stringPadStart(currentDateTime.getMonth() + 1, 2, '0')
    const year = currentDateTime.getFullYear()
    return {curHrs:hrs, curMins:mins, curDay:day, curMonth:month, curYear:year}
}
import { stringPadStart } from "./stringPadStart"
import { timeConversion } from "./timeConversion"
import { convertToHoursAndMinutes } from "./convertToHoursAndMinutes"

export function validateTime(time, date){
    console.log(typeof time, time , date, "validate function")
    let taskTime
    if(typeof time === 'object'){
        taskTime = `${time.getHours()}:${time.getMinutes()}`
    }
    else{
        taskTime = time
    }
    let {hours, minutes} = convertToHoursAndMinutes(taskTime)
    hours = Number(hours)
    minutes = Number(minutes)
    if(hours > 24 && minutes === 0) {
        const num1 = stringPadStart(hours.toString()[0], 2, '0')
        const num2 = stringPadStart(hours.toString()[1], 2, '0')
        hours = num1
        minutes = num2
        return {isValid: true, validatedHour: hours, validatedMins: minutes}
    }
    else if(hours < 24 && minutes >= 60){
        let {convertedHrs, convertedMins} = timeConversion(minutes)
        hours += convertedHrs
        hours = stringPadStart((hours % 24), 2, '0')
        minutes = stringPadStart(convertedMins, 2, '0')
        return {isValid: true, validatedHour: hours, validatedMins: minutes, prevTime: `${hours}:${minutes}`}
    }
    else{
        console.log(hours, minutes, "vh, vm")
        const dateTime = new Date(`${date} ${hours}:${minutes}`)
        console.log(date, hours, minutes, dateTime, "date time")
        if(isNaN(dateTime) || isNaN(time)){
            return {isValid: false, validatedHour: '', validatedMins: ''}
        }
        else{
            return {isValid: true, validatedHour: hours, validatedMins: minutes}
        }
    }
}
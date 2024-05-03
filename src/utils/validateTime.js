import { stringPadStart } from "./stringPadStart"
import { timeConversion } from "./timeConversion"
import { convertToHoursAndMinutes } from "./convertToHoursAndMinutes"

export function validateTime(time, date){
    console.log(time, date, "timev date")
    let taskTime
    if(typeof time === 'object'){
        taskTime = `${time.getHours()}:${time.getMinutes()}`
    }
    else{
        taskTime = time
    }
    let {hours, minutes, isValid} = convertToHoursAndMinutes(taskTime)
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
        if(!isValid || hours > 24){
            return {isValid: false, validatedHour: '', validatedMins: ''} 
        }
        const dateTime = new Date(`${date} ${hours}:${minutes}`)

        if((typeof dateTime !== 'object')){
            return {isValid: false, validatedHour: '', validatedMins: ''}
        }
        else{
            return {isValid: true, validatedHour: hours, validatedMins: minutes}
        }
    }
}
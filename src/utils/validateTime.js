import { timeConversion } from "./timeConversion"
import { convertToHoursAndMinutes } from "./convertToHoursAndMinutes"

export function validateTime(time){
    let {hours, minutes, isValid} = convertToHoursAndMinutes(time)
    if(hours > 24 || !isValid){
        return {isValid: false, validatedHour: '', validatedMins: ''} 
    }

    if(hours < 24 && minutes >= 60){
        let {convertedHrs, convertedMins} = timeConversion(minutes)
        hours += convertedHrs
        hours = (hours % 24)
        minutes = convertedMins

        return {isValid: true, validatedHour: hours.toString().padStart(2,'0'), validatedMins: minutes.toString().padStart(2,'0')}
    }
    else{
        return {isValid: true, validatedHour: hours.toString().padStart(2,'0'), validatedMins: minutes.toString().padStart(2,'0')}
    }
}
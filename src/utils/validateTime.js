import { timeConversion } from "./timeConversion"
import { convertToHoursAndMinutes } from "./convertToHoursAndMinutes"

export function validateTime(time, date){
    let {hours, minutes, isValid} = convertToHoursAndMinutes(time)
    hours = Number(hours)
    minutes = Number(minutes)
    if(hours > 24 && minutes === 0) {
        return {isValid: true, validatedHour: hours.toString()[0].padStart(2, '0'), validatedMins: hours.toString()[1].padStart(2, '0')}
    }
    else if(hours < 24 && minutes >= 60){
        let {convertedHrs, convertedMins} = timeConversion(minutes)
        hours += convertedHrs
        hours = (hours % 24).toString().padStart(2,'0')
        minutes = convertedMins.toString().padStart(2, '0')

        return {isValid: true, validatedHour: hours, validatedMins: minutes}
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
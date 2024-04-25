import { stringPadStart } from "./stringPadStart"
import { timeConversion } from "./timeConversion"
import { convertToHoursAndMinutes } from "./convertToHoursAndMinutes"

export function validateTime(time, prevTime){
    let {hours, minutes, isValid, expectedLength, value} = convertToHoursAndMinutes(time)
    if(!isValid){
        return {isValid: isValid, validatedHour: '', validatedMins: '', prevTime: prevTime}
    }

    if(value.length <= expectedLength && (isValid) && Number(value) >= 0){
        hours = hours === '' || hours === '24' ? 0 : Number(hours)
        minutes = minutes === '' ? 0 : Number(minutes)

        if(hours < 24 && minutes < 60){
            hours = stringPadStart(hours, 2, '0')
            minutes = stringPadStart(minutes, 2, '0')
            prevTime =  `${hours}:${minutes}`
            return {isValid: true, validatedHour: hours, validatedMins: minutes, prevTime:`${hours}:${minutes}`}
        }
        else if(hours > 24 && minutes === 0) {
            const num1 = stringPadStart(hours.toString()[0], 2, '0')
            const num2 = stringPadStart(hours.toString()[1], 2, '0')
            hours = num1
            minutes = num2
            prevTime =  `${hours}:${minutes}`
            return {isValid: true, validatedHour: hours, validatedMins: minutes, prevTime: `${hours}:${minutes}`}
        }
        else if(hours < 24 && minutes >= 60){
            let {convertedHrs, convertedMins} = timeConversion(minutes)
            hours += convertedHrs
            hours = stringPadStart((hours % 24), 2, '0')
            minutes = stringPadStart(convertedMins, 2, '0')
            prevTime =  `${hours}:${minutes}`
            return {isValid: true, validatedHour: hours, validatedMins: minutes, prevTime: `${hours}:${minutes}`}
        }
        else{
            return {isValid: false, validatedHour: '', validatedMins: '', prevTime: prevTime}
        }
    }
    else{
        return {isValid: false, validatedHour: '', validatedMins: '', prevTime: prevTime}
    }
}
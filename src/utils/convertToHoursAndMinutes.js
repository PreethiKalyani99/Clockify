import { splitToHoursAndMinutes } from "./splitToHoursAndMinutes"

export function convertToHoursAndMinutes(time) {
    let { hours, minutes, isValid } = splitToHoursAndMinutes(time)
    if (hours > 24 || !isValid) {
        return { isValid: false, validatedHour: '', validatedMins: '' }
    }

    if (minutes < 60) {
        return { isValid: true, validatedHour: hours.toString().padStart(2, '0'), validatedMins: minutes.toString().padStart(2, '0') }
    }

    hours = (hours + (Math.floor(minutes / 60))) % 24
    minutes = minutes % 60 

    return { isValid: true, validatedHour: hours.toString().padStart(2, '0'), validatedMins: minutes.toString().padStart(2, '0') }

}
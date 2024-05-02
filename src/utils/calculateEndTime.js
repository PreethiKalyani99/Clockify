import { convertToTimeComponents } from "./convertToTimeComponents";

export function calculateEndTime(startTime, totalTime){
    const startDate = new Date(startTime)
    const {hours, minutes, seconds, type} = convertToTimeComponents(totalTime)
    if(type === 'number'){
        startDate.setHours(hours + startDate.getHours(), minutes + startDate.getMinutes())
        return {isValid: true, newEndTime: startDate, timeDuration: `${hours.toString().padStart(2,'0')}:${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`}
    }
    else{
        return {isValid: false}
    }

}  
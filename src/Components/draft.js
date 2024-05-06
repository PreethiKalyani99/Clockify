import { convertToTimeComponents } from "./convertToTimeComponents";

export function calculateEndTime(startTime, totalTime){
    const startDate = new Date(startTime)
    const duration = new Date(startTime)
    const {hours, minutes, seconds, type} = convertToTimeComponents(totalTime)
    console.log(hours, minutes, seconds, "time components")
    if(type === 'number'){
        // startDate.setHours(hours + startDate.getHours(), minutes + startDate.getMinutes())
        // console.log(startDate, "calculate end Time", hours, minutes, seconds, "total duration")
        // const durationInMs = (hours * 60 * 60 + minutes * 60 + seconds) * 1000
        duration.setHours(hours,minutes,seconds)
        const totalDurationInMs = duration.setHours(hours, minutes, seconds)
        console.log(duration, "total duration in ms")
        
        const durationHours = Math.floor(totalDurationInMs / (1000 * 60 * 60))
        const durationMinutes = Math.floor((totalDurationInMs % (1000 * 60 * 60)) / (1000 * 60))
        const durationSeconds = Math.floor((totalDurationInMs % (1000 * 60)) / 1000)   
        startDate.setHours(durationHours, durationMinutes, durationSeconds)  
        console.log(startDate, "total duration")   
        return {isValid: true, newEndTime: startDate, timeDuration: `${hours.toString().padStart(2,'0')}:${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`}
    }
    else{
        return {isValid: false}
    }

}  
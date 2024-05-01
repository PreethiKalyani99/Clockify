import { stringPadStart } from "./stringPadStart";
import { convertToTimeComponents } from "./convertToTimeComponents";

export function calculateEndTime(startTime, totalTime){
    const startTimeHours = startTime.getHours()
    const startTimeMinutes = startTime.getMinutes()
    console.log(startTimeHours, startTimeMinutes, "sh sm")
    const {hours, minutes, seconds, isValid} = convertToTimeComponents(totalTime)
    console.log(hours, typeof hours, minutes, typeof minutes, seconds, typeof seconds, "check output - convert to HMS")
    const endTimeHours = startTimeHours + hours
    const endTimeMinutes = startTimeMinutes + minutes

    startTime.setHours(endTimeHours, endTimeMinutes)
    const newEndTime = `${startTime.getHours()}:${startTime.getMinutes()}`


   

    return {endTime: newEndTime, totalTime: `${stringPadStart(hours, 2, '0')}:${stringPadStart(minutes, 2, "0")}:${stringPadStart(seconds,2, '0')}`}
}  
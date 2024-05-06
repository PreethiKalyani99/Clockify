import { calculateTimeDifference } from "./calculateTimeDifference";

export function checkTotalDurationLimit(startTime, endTime){
    console.log(startTime, endTime, "check total duration limit")
    const {hours} = calculateTimeDifference(startTime, endTime)
    console.log(hours, "hours limit")
    if(hours > 999){
        return true
    }
    return false
}
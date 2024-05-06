import { calculateTimeDifference } from "./calculateTimeDifference";

export function isDurationLimitExceeded(startTime, endTime){
    const {hours} = calculateTimeDifference(startTime, endTime)
    if(hours > 999){
        return true
    }
    return false
}
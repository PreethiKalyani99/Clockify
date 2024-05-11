import { calculateTimeDifference } from "./calculateTimeDifference";

export function isDurationLimitExceeded(startTime, endTime){
    const {hours} = calculateTimeDifference(startTime, endTime)
    return hours > 999
}
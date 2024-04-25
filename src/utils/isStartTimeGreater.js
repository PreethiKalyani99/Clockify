export function isStartTimeGreater(startTime, endTime){
    if(startTime[0] > endTime[0]){
        return true
    }
    else if(startTime[1] > endTime[1]){
        return true
    }
    return false
}
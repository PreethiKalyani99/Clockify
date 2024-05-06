
export function calculateTimeDifference(startTime, endTime) {
    let totalDuration = startTime > endTime ? (startTime - endTime) : (endTime - startTime)
    
    const hours = Math.floor(totalDuration / (1000 * 60 * 60))
    const minutes = Math.floor((totalDuration % (1000 * 60 * 60)) / (1000 * 60))

    return {hours, minutes}
}

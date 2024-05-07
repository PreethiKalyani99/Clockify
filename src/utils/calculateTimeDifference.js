
export function calculateTimeDifference(startTime, endTime) {
    let totalDuration = Math.abs(startTime - endTime)
    
    const hours = Math.floor(totalDuration / (1000 * 60 * 60))
    const minutes = Math.floor((totalDuration % (1000 * 60 * 60)) / (1000 * 60))

    return {hours, minutes}
}

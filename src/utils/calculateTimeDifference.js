
export function calculateTimeDifference(startTime, endTime) {
    let totalDuration = startTime > endTime ? (startTime - endTime) : (endTime - startTime)
    
    console.log(totalDuration, "total duration ms")
    const hours = Math.floor(totalDuration / (1000 * 60 * 60))
    const minutes = Math.floor((totalDuration % (1000 * 60 * 60)) / (1000 * 60))

    console.log(hours, minutes, 'calculate time difference')
    return {hours, minutes}
}

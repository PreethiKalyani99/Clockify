import { stringPadStart } from "./stringPadStart";

export function calculateTimeDifference(startTime, endTime) {
    let startHour = startTime[0]
    let startMinute = startTime[1]
    let endHour = endTime[0]
    let endMinute = endTime[1]

    const totalStartTime = startHour * 60 + startMinute
    const totalEndTime = endHour * 60 + endMinute

    let timeDiffMinutes
    if (totalEndTime >= totalStartTime) {
        timeDiffMinutes = totalEndTime - totalStartTime
    } else {
        timeDiffMinutes = 24 * 60 - totalStartTime + totalEndTime
    }

    const hoursDiff = Math.floor(timeDiffMinutes / 60)
    const minutesDiff = timeDiffMinutes % 60

    const hours = stringPadStart(hoursDiff, 2, '0')
    const minutes = stringPadStart(minutesDiff, 2, '0')

    return { hours: hours, minutes: minutes }
}

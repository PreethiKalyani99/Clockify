import { stringPadStart } from "./stringPadStart";

export function calculateTimeDifference(startTime, endTime) {
    let startHour = startTime.getHours()
    let startMinute = startTime.getMinutes()
    let endHour = endTime.getHours()
    let endMinute = endTime.getMinutes()

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

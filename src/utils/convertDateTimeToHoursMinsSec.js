export function convertDateTimeToHoursMinsSec(dateTime){
    const hours = dateTime.getHours()
    const minutes = dateTime.getMinutes()
    const seconds = dateTime.getSeconds()

    return {hours, minutes, seconds}
}
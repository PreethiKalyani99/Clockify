export function convertDateTimeToHoursMinsSec(dateTime){
    const hours = dateTime.getHours()
    const minutes = dateTime.getMinutes()
    const seconds = dateTime.getSeconds()

    return {hours: hours.toString().padStart(2, '0'), minutes: minutes.toString().padStart(2, '0'), seconds: seconds.toString().padStart(2, '0')}
}
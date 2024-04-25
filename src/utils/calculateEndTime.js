import { splitTime } from "./splitTime";
import { timeConversion } from "./timeConversion";
import { stringPadStart } from "./stringPadStart";
import { convertToHMS } from "./convertToHMS";

export function calculateEndTime(startTime, endTime, totalTime){
    const {hours, minutes, seconds, isValid} = convertToHMS(totalTime)

    const startTimeArr = splitTime(startTime, ":")

    const startTimeMins = startTimeArr[0] * 60 + startTimeArr[1]
    const totalTimeMins = hours * 60 + minutes

    const totalMins = startTimeMins + totalTimeMins

    const {convertedHrs, convertedMins} = timeConversion(totalMins) 

    return {startTime, endTime: `${stringPadStart(convertedHrs,2, '0')}:${stringPadStart(convertedMins, 2, "0")}`, totalTime: `${stringPadStart(hours, 2, '0')}:${stringPadStart(minutes, 2, "0")}:${stringPadStart(seconds,2, '0')}`, isValid}
}  
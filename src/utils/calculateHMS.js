import {splitTime} from './splitTime'
import { formatTime } from './formatTime'

export function calculateHMS(totalTime){
    const [hours, minutes, seconds] = splitTime(totalTime, ':')

    if(hours === 999 && minutes === 0 && seconds === 0){
        return {totalTime: '999:00:00'}
    }
    else{
        const timeInMs = (hours * 60 * 60 + minutes * 60 + seconds) * 1000
        return {totalTime: formatTime(timeInMs)}
    }

}
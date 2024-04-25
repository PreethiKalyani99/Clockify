import { stringPadStart } from "./stringPadStart"

export function formatTime(timeInMs){
    const hours = Math.floor(timeInMs / (1000 * 60 * 60))
    const minutes = Math.floor((timeInMs % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((timeInMs % (1000 * 60)) / 1000)
    
    return `${stringPadStart(hours, 2, '0')}:${stringPadStart(minutes, 2, '0')}:${stringPadStart(seconds, 2, '0')}`
}
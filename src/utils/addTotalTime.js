import { parseISODuration } from "./parseISODuration"

export function addTotalTime(tasks){
    const totalTimeInMS = tasks.reduce((acc, cur) => {
       const [hours, minutes, seconds] = (parseISODuration(cur.timeInterval.duration)).split(':').map(Number)
       acc += (hours * 60 * 60 + minutes * 60 + seconds) * 1000
       return acc
    }, 0)

    const sec = Math.floor((totalTimeInMS / 1000) % 60)
    const min = Math.floor((totalTimeInMS / (1000 * 60)) % 60)
    const hrs = Math.floor((totalTimeInMS / (1000 * 60 * 60)))

    return `${hrs.toString().padStart(2,'0')}:${min.toString().padStart(2,'0')}:${sec.toString().padStart(2,'0')}`
}
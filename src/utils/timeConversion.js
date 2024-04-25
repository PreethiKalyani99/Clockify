export function timeConversion(time){
    if(!isNaN(time) && Number(time) >= 0){
        const hours = Math.floor(Number(time) / 60) % 24
        const mins = Number(time) % 60
    
        return {convertedHrs: hours, convertedMins: mins}
    }
    else{
        return {convertedHrs: 0, convertedMins: 0}
    }
}
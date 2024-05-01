import { splitTime } from "./splitTime"

// export function convertToHMS(value){
//     let  hours = '', minutes = '', seconds = '', isValid = false
//     let occurrences = (value.match(/[:-]/g) || []).length
//     if(isNaN(value.replace(/[:-]/g, '')) || (occurrences > 2) || (/::|:-|-:|--/.test(value))){
//         hours = ''
//         minutes = ''
//         seconds = ''
//         value = hours + minutes + seconds
//         isValid= false
//         return {hours: hours, minutes: minutes, seconds: seconds, isValid: isValid}
//     }
//     else if(!isNaN(value) && value.length > 5){
//         hours = '999'
//         minutes = '0'
//         seconds = '0'
//         value = hours + minutes + seconds
//         isValid = false
//         return {hours: hours, minutes: minutes, seconds: seconds, isValid: isValid}
//     }
//     else if(!isNaN(value) && value.length > 0 && value.length < 6){
//         hours = value.slice(0, -2)
//         minutes = value.slice(-2)
//         seconds = ''
//         value = hours + minutes + seconds
//         isValid = true
//         return {hours: hours, minutes: minutes, seconds: seconds, isValid: isValid}
//     }
//     else if(!isNaN(value.replace(/[:-]/g, ''))){
//         const time = value.split(/:|-/)
//         hours = time[0]
//         minutes = time.length > 1 ? time[1] : ''
//         seconds = time.length > 2 ? time[2] : ''
//         if((hours.length <= 4) && (minutes.length < 5) && (seconds.length < 7)){ 
//             isValid = true
//             return {hours: hours, minutes: minutes, seconds: seconds, isValid: isValid}
//         }
//         else{
//             hours = '999'
//             minutes = '0'
//             seconds = '0'
//             value = hours + minutes + seconds
//             isValid = false
//             return {hours: hours, minutes: minutes, seconds: seconds, isValid: isValid}
//         }
//     }
// }


export function convertToTimeComponents(value){
    console.log(value, "value")
    let hours, minutes, seconds, isValid = false 
    if(isNaN(value.replace(/[:-]/g, ''))){
        console.log('1')
        hours = 999
        minutes = 0
        seconds = 0
        return {hours, minutes, seconds, isValid}
    }

    const newValue = value.replaceAll(/-/g, ':')
    const time = splitTime(newValue, ':')

    if(time.length > 3){
        return {hours: 999, minutes: 0, seconds: 0, isValid: false}
    }

    if(time.length === 1){
        hours = Number(time[0].toString().slice(0,-2))
        minutes = Number(time[0].toString().slice(-2))
        seconds = 0

        hours = hours + Math.floor(minutes/60)
        minutes = minutes % 60

        if(hours > 999){
            return {hours: 999, minutes: 0, seconds: 0, isValid: false}
        }
        else{
            return {hours, minutes, seconds, isValid: true}
        }
    }

    if(time.length <= 3){
        console.log(time, "time")
        hours = time[0] ? time[0] : 0
        minutes = time[1] ? time[1] : 0 
        seconds = time[2] ? time[2] : 0

        minutes = minutes + Math.floor(seconds/60)
        seconds = seconds % 60
        hours = hours + Math.floor(minutes/60)
        minutes = minutes % 60

        if(hours > 999){
            return {hours: 999, minutes: 0, seconds: 0, isValid: false}
        }
        else{
            return {hours, minutes, seconds, isValid: true} 
        }
    
    }
    else{
        return {hours: 999, minutes: 0, seconds: 0, isValid: false}
    }
} 
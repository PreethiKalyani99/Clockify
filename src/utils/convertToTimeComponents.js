export function convertToTimeComponents(value){
    let hours, minutes, seconds, isValid = false 
    if(isNaN(value.replace(/[:-]/g, ''))){
        hours = 999
        minutes = 0
        seconds = 0
        return {hours, minutes, seconds, isValid, type: 'string'}
    }

    const newValue = value.replaceAll(/-/g, ':')
    const time =  newValue.split(':').map(Number) 
    if(time.length > 3){
        return {hours: 999, minutes: 0, seconds: 0, isValid: false, type: 'string'}
    }

    if(time.length === 1){
        hours = Number(time[0].toString().slice(0,-2))
        minutes = Number(time[0].toString().slice(-2))
        seconds = 0

        hours = hours + Math.floor(minutes/60)
        minutes = minutes % 60

        if(hours > 999){
            return {hours: 999, minutes: 0, seconds: 0, isValid: false, type: 'number'}
        }
        else{
            return {hours, minutes, seconds, isValid: true, type: 'number'}
        }
    }

    if(time.length <= 3){
        hours = time[0] ? time[0] : 0
        minutes = time[1] ? time[1] : 0 
        seconds = time[2] ? time[2] : 0

        minutes = minutes + Math.floor(seconds/60)
        seconds = seconds % 60
        hours = hours + Math.floor(minutes/60)
        minutes = minutes % 60

        if(hours > 999){
            return {hours: 999, minutes: 0, seconds: 0, isValid: false, type: 'number'}
        }
        else{
            return {hours, minutes, seconds, isValid: true, type: 'number'} 
        }
    }
    else{
        return {hours: 999, minutes: 0, seconds: 0, isValid: false, type: 'number'}
    }
} 
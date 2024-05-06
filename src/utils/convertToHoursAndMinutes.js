export function convertToHoursAndMinutes(value){
    let expectedLength = 4

    if(isNaN(value.replace(':', '')) || (value.replace(':', '').length > expectedLength || value[0] === ':' || value[value.length-1] === ':' || value === '')){
        return {hours: '', minutes: '', isValid: false}
    }
    else if(value[1] === ':'){
        return {hours: value.slice(0, 1), minutes: value.slice(2), isValid: true}
    }
    else if(value[2] === ':'){
        const hours = Number(value.slice(0, 2)) === 24 ? 0 : value.slice(0,2)
        return {hours: hours, minutes: value.slice(3), isValid: true}
    }
    else if(Number(value) === 24){
        return {hours: 0, minutes: 0, isValid: true}
    }
    else if((Number(value) < 24) && (value.length === 1 || value.length === 2)){
        return {hours: value, minutes: 0, isValid: true}
    }
    else if((Number(value) > 24) && (value.length === 2 || value.length === 3)){
        return {hours: value.slice(0,1), minutes: value.slice(1), isValid: true}
    }
    else{
        return {hours: value.slice(0,2), minutes: value.slice(2,4), isValid: true}
    }
}
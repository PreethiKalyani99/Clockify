export function convertToHoursAndMinutes(value){
    console.log(value, 'value')
    let expectedLength = 4, hours = '', minutes = '', isValid = false
    if(isNaN(value.replace(':', '')) || (!isNaN(value) && value.length > expectedLength)){
        hours = ''
        minutes = ''
        value = hours + minutes
        isValid = false
        return {hours: hours, minutes: minutes, isValid: isValid, expectedLength: expectedLength, value: value}
    }
    else if(value[0] === ':' || value[value.length-1] === ':' || value === ''){
        hours = ''
        minutes = ''
        value = hours + minutes
        isValid = false
        return {hours: hours, minutes: minutes, isValid: isValid, expectedLength: expectedLength, value: value}
    }
    else if(value[1] === ':'){
        hours = value.slice(0, 1)
        minutes = value.slice(2)
        expectedLength = 3
        isValid = true
        value = hours + minutes
        return {hours: hours, minutes: minutes, isValid: isValid, expectedLength: expectedLength, value: value}
    }
    else if(value[2] === ':'){
        hours = value.slice(0, 2)
        minutes = value.slice(3) 
        isValid = true
        value = hours + minutes
        return {hours: hours, minutes: minutes, isValid: isValid, expectedLength: expectedLength, value: value}
    }
    else if((Number(value) < 24) && (value.length === 1 || value.length === 2)){
        hours = value
        minutes = '0'
        isValid = true
        value = hours + minutes
        return {hours: hours, minutes: minutes, isValid: isValid, expectedLength: expectedLength, value: value}
    }
    else if((Number(value) > 24) && (value.length === 2 || value.length === 3)){
        hours = value.slice(0,1)
        minutes = value.slice(1)
        isValid = true
        value = hours + minutes
        return {hours: hours, minutes: minutes, isValid: isValid, expectedLength: expectedLength, value: value}
    }
    else{
        hours = value.slice(0,2)
        minutes = value.slice(2,4)
        isValid = true
        value = hours + minutes
        return {hours: hours, minutes: minutes, isValid: isValid, expectedLength: expectedLength, value: value}
    }
}
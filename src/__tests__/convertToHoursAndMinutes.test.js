import { convertToHoursAndMinutes } from "../utils/convertToHoursAndMinutes";

test('should return as hours and minutes for the given time', () => {
    expect(convertToHoursAndMinutes('12:30')).toStrictEqual({hours: 12, minutes: 30, isValid: true})
})

test('should return false when time has separators other than colon', () => {
    expect(convertToHoursAndMinutes('12-30')).toStrictEqual({hours: 0, minutes: 0, isValid: false})
})

test('should return false when time has more than one separator', () => {
    expect(convertToHoursAndMinutes('12:-30')).toStrictEqual({hours: 0, minutes: 0, isValid: false})  
    expect(convertToHoursAndMinutes('12::30')).toStrictEqual({hours: 0, minutes: 0, isValid: false})  
})

test('should return false when the value of the time is string', () => {
    expect(convertToHoursAndMinutes('')).toStrictEqual({hours: 0, minutes: 0, isValid: false})  
    expect(convertToHoursAndMinutes('hjsfdhj')).toStrictEqual({hours: 0, minutes: 0, isValid: false})
    expect(convertToHoursAndMinutes('12:3sdafsdf0')).toStrictEqual({hours: 0, minutes: 0, isValid: false})
})

test('should return first digit as hours and last 2 digit as minutes when length of the time is 3', () => {
    expect(convertToHoursAndMinutes('123')).toStrictEqual({hours: 1, minutes: 23, isValid: true})
})

test('should return as hours when length of the time is 2 and the value is less than 24', () => {
    expect(convertToHoursAndMinutes('12')).toStrictEqual({hours: 12, minutes: 0, isValid: true})
})

test('should return first digit as hours and last digit as minutes when length of the time is 2 and the value is less than 24', () => {
    expect(convertToHoursAndMinutes('34')).toStrictEqual({hours: 3, minutes: 4, isValid: true})
})

test('should return zero hours and zero minutes when length of the time is 2 and the value is equal to 24', () => {
    expect(convertToHoursAndMinutes('24')).toStrictEqual({hours: 0, minutes: 0, isValid: true}) 
})

test('should return as hours when length of the time is 1', () => {
    expect(convertToHoursAndMinutes('1')).toStrictEqual({hours: 1, minutes: 0, isValid: true})
})

test('should return first 2 digit as hours and last 2 digit as minutes when length of the time is 4 without colon', () => {
    expect(convertToHoursAndMinutes('1289')).toStrictEqual({hours: 12, minutes: 89, isValid: true})
})
 
test('should return false when length of the time is greater than 4', () => {
    expect(convertToHoursAndMinutes('01289')).toStrictEqual({hours: 0, minutes: 0, isValid: false})
    expect(convertToHoursAndMinutes('81289')).toStrictEqual({hours: 0, minutes: 0, isValid: false})
    expect(convertToHoursAndMinutes('128932778379832')).toStrictEqual({hours: 0, minutes: 0, isValid: false})
})

test('should return false when the value is less than zero', () => {
    expect(convertToHoursAndMinutes('-23')).toStrictEqual({hours: 0, minutes: 0, isValid: false}) 
})

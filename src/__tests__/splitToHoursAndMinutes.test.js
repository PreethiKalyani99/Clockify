import { splitToHoursAndMinutes } from "../utils/splitToHoursAndMinutes";

test('should return as hours and minutes for the given time', () => {
    expect(splitToHoursAndMinutes('12:30')).toStrictEqual({hours: 12, minutes: 30, isValid: true})
})

test('should return false when time has separators other than colon', () => {
    expect(splitToHoursAndMinutes('12-30')).toStrictEqual({hours: 0, minutes: 0, isValid: false})
})

test('should return false when time has more than one separator', () => {
    expect(splitToHoursAndMinutes('12:-30')).toStrictEqual({hours: 0, minutes: 0, isValid: false})  
    expect(splitToHoursAndMinutes('12::30')).toStrictEqual({hours: 0, minutes: 0, isValid: false})  
})

test('should return false when the value of the time is string', () => {
    expect(splitToHoursAndMinutes('')).toStrictEqual({hours: 0, minutes: 0, isValid: false})  
    expect(splitToHoursAndMinutes('hjsfdhj')).toStrictEqual({hours: 0, minutes: 0, isValid: false})
    expect(splitToHoursAndMinutes('12:3sdafsdf0')).toStrictEqual({hours: 0, minutes: 0, isValid: false})
})

test('should return first digit as hours and last 2 digit as minutes when length of the time is 3', () => {
    expect(splitToHoursAndMinutes('123')).toStrictEqual({hours: 1, minutes: 23, isValid: true})
})

test('should return as hours when length of the time is 2 and the value is less than 24', () => {
    expect(splitToHoursAndMinutes('12')).toStrictEqual({hours: 12, minutes: 0, isValid: true})
})

test('should return first digit as hours and last digit as minutes when length of the time is 2 and the value is less than 24', () => {
    expect(splitToHoursAndMinutes('34')).toStrictEqual({hours: 3, minutes: 4, isValid: true})
})

test('should return zero hours and zero minutes when length of the time is 2 and the value is equal to 24', () => {
    expect(splitToHoursAndMinutes('24')).toStrictEqual({hours: 0, minutes: 0, isValid: true}) 
})

test('should return as hours when length of the time is 1', () => {
    expect(splitToHoursAndMinutes('1')).toStrictEqual({hours: 1, minutes: 0, isValid: true})
})

test('should return first 2 digit as hours and last 2 digit as minutes when length of the time is 4 without colon', () => {
    expect(splitToHoursAndMinutes('1289')).toStrictEqual({hours: 12, minutes: 89, isValid: true})
})
 
test('should return false when length of the time is greater than 4', () => {
    expect(splitToHoursAndMinutes('01289')).toStrictEqual({hours: 0, minutes: 0, isValid: false})
    expect(splitToHoursAndMinutes('81289')).toStrictEqual({hours: 0, minutes: 0, isValid: false})
    expect(splitToHoursAndMinutes('128932778379832')).toStrictEqual({hours: 0, minutes: 0, isValid: false})
})

test('should return false when the value is less than zero', () => {
    expect(splitToHoursAndMinutes('-23')).toStrictEqual({hours: 0, minutes: 0, isValid: false}) 
})

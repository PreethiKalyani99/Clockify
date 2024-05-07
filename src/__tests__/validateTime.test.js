import { validateTime } from "../utils/validateTime";

test('should return as hours and minutes for the given time', () => {
    expect(validateTime('12:30')).toStrictEqual({isValid: true, validatedHour: '12', validatedMins: '30'}) 
})

test('should return false when the value of the time is string', () => {
    expect(validateTime('12:sadafsdd30')).toStrictEqual({isValid: false, validatedHour: '', validatedMins: ''}) 
    expect(validateTime('kjsfkjsfjk')).toStrictEqual({isValid: false, validatedHour: '', validatedMins: ''})  
})

test('should calculate hours and minutes when minutes is greater than 60', () => {
    expect(validateTime('12:70')).toStrictEqual({isValid: true, validatedHour: '13', validatedMins: '10'})  
})

test('should return false when length of the time is greater than 2 and the hours part is greater than 24', () => {
    expect(validateTime('3478')).toStrictEqual({isValid: false, validatedHour: '', validatedMins: ''})  
})

test('should return first digit as hours and last digit as minutes when length of the time is 2 and the value is less than 24', () => {
    expect(validateTime('34')).toStrictEqual({isValid: true, validatedHour: '03', validatedMins: '04'})  
})

test('should return zero hours and zero minutes when the hours is equal to 24', () => {
    expect(validateTime('24:00')).toStrictEqual({isValid: true, validatedHour: '00', validatedMins: '00'})  
})

test('should return false when time has more than one separator', () => {
    expect(validateTime('24::00')).toStrictEqual({isValid: false, validatedHour: '', validatedMins: ''})  
})
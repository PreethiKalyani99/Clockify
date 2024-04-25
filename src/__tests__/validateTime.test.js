import { validateTime } from "../utils/validateTime";

test('validate given time', () => {
    expect(validateTime('12:30', '01:00')).toStrictEqual({isValid: true, validatedHour: '12', validatedMins: '30', prevTime: '12:30'}) 
})


test('validate given time', () => {
    expect(validateTime('12:sadafsdd30', '01:00')).toStrictEqual({isValid: false, validatedHour: '', validatedMins: '', prevTime: '01:00'}) 
})


test('validate given time', () => {
    expect(validateTime('kjsfkjsfjk', '02:00')).toStrictEqual({isValid: false, validatedHour: '', validatedMins: '', prevTime: '02:00'})  
})


test('validate given time', () => {
    expect(validateTime('12345', '02:00')).toStrictEqual({isValid: false, validatedHour: '', validatedMins: '', prevTime: '02:00'})  
})

test('validate given time', () => {
    expect(validateTime('12:70', '03:03')).toStrictEqual({isValid: true, validatedHour: '13', validatedMins: '10', prevTime: '13:10'})  
})


test('validate given time', () => {
    expect(validateTime('25:30', '01:00')).toStrictEqual({isValid: false, validatedHour: '', validatedMins: '', prevTime: '01:00'}) 
})

test('validate given time', () => {
    expect(validateTime('34:70', '03:00')).toStrictEqual({isValid: false, validatedHour: '', validatedMins: '', prevTime: '03:00'}) 
})

test('validate given time', () => {
    expect(validateTime('34:', '03:00')).toStrictEqual({isValid: false, validatedHour: '', validatedMins: '', prevTime: '03:00'})  
})

test('validate given time', () => {
    expect(validateTime(':50', '03:00')).toStrictEqual({isValid: false, validatedHour: '', validatedMins: '', prevTime: '03:00'})  
})

test('validate given time', () => {
    expect(validateTime('1234', '03:00')).toStrictEqual({isValid: true, validatedHour: '12', validatedMins: '34', prevTime: '12:34'})  
})

test('validate given time', () => {
    expect(validateTime('24', '03:00')).toStrictEqual({isValid: true, validatedHour: '00', validatedMins: '00', prevTime: '00:00'})  
})

test('validate given time', () => {
    expect(validateTime('2359', '03:00')).toStrictEqual({isValid: true, validatedHour: '23', validatedMins: '59', prevTime: '23:59'})  
})

test('validate given time', () => {
    expect(validateTime('3478', '03:00')).toStrictEqual({isValid: false, validatedHour: '', validatedMins: '', prevTime: '03:00'})  
})

test('validate given time', () => {
    expect(validateTime('34', '03:00')).toStrictEqual({isValid: true, validatedHour: '03', validatedMins: '04', prevTime: '03:04'})  
})

test('validate given time', () => {
    expect(validateTime('24', '03:00')).toStrictEqual({isValid: true, validatedHour: '00', validatedMins: '00', prevTime: '00:00'})  
})

test('validate given time', () => {
    expect(validateTime('2', '03:00')).toStrictEqual({isValid: true, validatedHour: '02', validatedMins: '00', prevTime: '02:00'})   
})

test('validate given time', () => {
    expect(validateTime('3415', '03:00')).toStrictEqual({isValid: false, validatedHour: '', validatedMins: '', prevTime: '03:00'})  
})

test('validate given time', () => {
    expect(validateTime('24:00', '03:00')).toStrictEqual({isValid: true, validatedHour: '00', validatedMins: '00', prevTime: '00:00'})  
})

test('validate given time', () => {
    expect(validateTime('24::00', '03:00')).toStrictEqual({isValid: false, validatedHour: '', validatedMins: '', prevTime: '03:00'})  
})
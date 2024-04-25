import { convertToHoursAndMinutes } from "../utils/convertToHoursAndMinutes";

test('split and check the given value is valid time', () => {
    expect(convertToHoursAndMinutes('12:30')).toStrictEqual({hours: '12', minutes: '30', isValid: true, expectedLength: 4, value: '1230'})
})

test('split and check the given value is valid time', () => {
    expect(convertToHoursAndMinutes('12-30')).toStrictEqual({hours: '', minutes: '', isValid: false, expectedLength: 4, value: ''})
})

test('split and check the given value is valid time', () => {
    expect(convertToHoursAndMinutes('12:-30')).toStrictEqual({hours: '', minutes: '', isValid: false, expectedLength: 4, value: ''})  
})

test('split and check the given value is valid time', () => {
    expect(convertToHoursAndMinutes('12::30')).toStrictEqual({hours: '', minutes: '', isValid: false, expectedLength: 4, value: ''})  
})

test('split and check the given value is valid time', () => {
    expect(convertToHoursAndMinutes('')).toStrictEqual({hours: '', minutes: '', isValid: false, expectedLength: 4, value: ''})  
})

test('split and check the given value is valid time', () => {
    expect(convertToHoursAndMinutes('hjsfdhj')).toStrictEqual({hours: '', minutes: '', isValid: false, expectedLength: 4, value: ''})
})

test('split and check the given value is valid time', () => {
    expect(convertToHoursAndMinutes('12:3sdafsdf0')).toStrictEqual({hours: '', minutes: '', isValid: false, expectedLength: 4, value: ''})
})

test('split and check the given value is valid time', () => {
    expect(convertToHoursAndMinutes('123')).toStrictEqual({hours: '1', minutes: '23', isValid: true, expectedLength: 4, value: '123'})
})

test('split and check the given value is valid time', () => {
    expect(convertToHoursAndMinutes('12')).toStrictEqual({hours: '12', minutes: '0', isValid: true, expectedLength: 4, value: '120'})
})

test('split and check the given value is valid time', () => {
    expect(convertToHoursAndMinutes('1')).toStrictEqual({hours: '1', minutes: '0', isValid: true, expectedLength: 4, value: '10'})
})

test('split and check the given value is valid time', () => {
    expect(convertToHoursAndMinutes('1289')).toStrictEqual({hours: '12', minutes: '89', isValid: true, expectedLength: 4, value: '1289'})
})

test('split and check the given value is valid time', () => {
    expect(convertToHoursAndMinutes('128932778379832')).toStrictEqual({hours: '', minutes: '', isValid: false, expectedLength: 4, value: ''})
})

test('split and check the given value is valid time', () => {
    expect(convertToHoursAndMinutes('68677')).toStrictEqual({hours: '', minutes: '', isValid: false, expectedLength: 4, value: ''})
})

test('split and check the given value is valid time', () => {
    expect(convertToHoursAndMinutes('7869')).toStrictEqual({hours: '78', minutes: '69', isValid: true, expectedLength: 4, value: '7869'})
})

test('split and check the given value is valid time', () => {
    expect(convertToHoursAndMinutes('34')).toStrictEqual({hours: '3', minutes: '4', isValid: true, expectedLength: 4, value: '34'})
})
import { convertToHMS } from "../utils/convertToHMS";

test('convert the given value to hours, minutes and seconds', () => {
    expect(convertToHMS('1')).toStrictEqual({hours: 0, minutes: 1, seconds: 0, isValid: true})
})

test('convert the given value to hours, minutes and seconds', () => {
    expect(convertToHMS('12')).toStrictEqual({hours: 0, minutes: 12, seconds: 0, isValid: true})
})

test('convert the given value to hours, minutes and seconds', () => {
    expect(convertToHMS('123')).toStrictEqual({hours: 1, minutes: 23, seconds: 0, isValid: true}) 
})

test('convert the given value to hours, minutes and seconds', () => {
    expect(convertToHMS('1234')).toStrictEqual({hours: 12, minutes: 34, seconds: 0, isValid: true}) 
})

test('convert the given value to hours, minutes and seconds', () => {
    expect(convertToHMS('12345')).toStrictEqual({hours: 123, minutes: 45, seconds: 0, isValid: true})
})

test('convert the given value to hours, minutes and seconds', () => {
    expect(convertToHMS('123456')).toStrictEqual({hours: 999, minutes: 0, seconds: 0, isValid: false}) 
})

test('convert the given value to hours, minutes and seconds', () => {
    expect(convertToHMS('123:99999:00')).toStrictEqual({hours: 999, minutes: 0, seconds: 0, isValid: false}) 
})

test('convert the given value to hours, minutes and seconds', () => {
    expect(convertToHMS('12334:12:00')).toStrictEqual({hours: 999, minutes: 0, seconds: 0, isValid: false}) 
})

test('convert the given value to hours, minutes and seconds', () => {
    expect(convertToHMS('123:99:0045')).toStrictEqual({hours: 124, minutes: 39, seconds: 45, isValid: true}) 
})

test('convert the given value to hours, minutes and seconds', () => {
    expect(convertToHMS('45:12:0087656')).toStrictEqual({hours: 69, minutes: 32, seconds: 56, isValid: true})  
})

test('convert the given value to hours, minutes and seconds', () => {
    expect(convertToHMS('dsajfhkjdf')).toStrictEqual({hours: 999, minutes: 0, seconds: 0, isValid: false})
})

test('convert the given value to hours, minutes and seconds', () => {
    expect(convertToHMS('23::43-4')).toStrictEqual({hours: 999, minutes: 0, seconds: 0, isValid: false})
})

test('convert the given value to hours, minutes and seconds', () => {
    expect(convertToHMS('12:-4:6')).toStrictEqual({hours: 999, minutes: 0, seconds: 0, isValid: false})
})

test('convert the given value to hours, minutes and seconds', () => {
    expect(convertToHMS('12:45:0')).toStrictEqual({hours: 12, minutes: 45, seconds: 0, isValid: true}) 
})

test('convert the given value to hours, minutes and seconds', () => {
    expect(convertToHMS('12-45:0')).toStrictEqual({hours: 12, minutes: 45, seconds: 0, isValid: true}) 
})

test('convert the given value to hours, minutes and seconds', () => {
    expect(convertToHMS('12-45-0')).toStrictEqual({hours: 12, minutes: 45, seconds: 0, isValid: true})  
})

test('convert the given value to hours, minutes and seconds', () => { 
    expect(convertToHMS('12:4:')).toStrictEqual({hours: 12, minutes: 4, seconds: 0, isValid: true})    
})

test('convert the given value to hours, minutes and seconds', () => {  
    expect(convertToHMS('12:')).toStrictEqual({hours: 12, minutes: 0, seconds: 0, isValid: true})    
})

test('convert the given value to hours, minutes and seconds', () => { 
    expect(convertToHMS('12:4:sdafsdf')).toStrictEqual({hours: 999, minutes: 0, seconds: 0, isValid: false})    
}) 

test('convert the given value to hours, minutes and seconds', () => { 
    expect(convertToHMS('12:4:23sajkdfhksjd')).toStrictEqual({hours: 999, minutes: 0, seconds: 0, isValid: false})     
}) 

test('', () =>{
    expect(convertToHMS("1234:567:789")).toStrictEqual({hours: 999, minutes: 0, seconds: 0, isValid: false})
}) 

test('convert the given value to hours, minutes and seconds', () => {  
    expect(convertToHMS(':12:')).toStrictEqual({hours: 0, minutes: 12, seconds: 0, isValid: true})     
})
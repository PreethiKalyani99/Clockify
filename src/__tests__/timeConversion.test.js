import { timeConversion } from "../utils/timeConversion";


test('check if time conversion function converts given number to hours and minutes', () => {
    expect(timeConversion(78)).toStrictEqual({convertedHrs: 1, convertedMins: 18})
})

test('convert string number to hours and minutes', () => {
    expect(timeConversion('78')).toStrictEqual({convertedHrs: 1, convertedMins: 18})
})

test('should not convert string to hours and minutes', () => {
    expect(timeConversion('string')).toStrictEqual({convertedHrs: 0, convertedMins: 0})
})

test('should not convert negative number to hours and minutes', () => {
    expect(timeConversion(-78)).toStrictEqual({convertedHrs: 0, convertedMins: 0})
})
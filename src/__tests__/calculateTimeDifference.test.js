import { calculateTimeDifference } from "../utils/calculateTimeDifference";

test('should return time difference when startTime is greater than endTime', () => {
    const startTime = new Date('2024-05-01 12:30')
    const endTime = new Date('2024-05-02 02:04')
    expect(calculateTimeDifference(startTime, endTime)).toStrictEqual({hours: 13, minutes: 34}) 
})

test('should return 0 hours and 0 minutes when starTime and endTime are same', () => {
    const startTime = new Date('2024-05-01 00:00')
    const endTime = new Date('2024-05-01 00:00')
    expect(calculateTimeDifference(startTime, endTime)).toStrictEqual({hours: 0, minutes: 0})  
})

test('should return time difference when startTime is less than endTime', () => {
    const startTime = new Date('2024-05-01 00:00')
    const endTime = new Date('2024-05-01 21:00')
    expect(calculateTimeDifference(startTime, endTime)).toStrictEqual({hours: 21, minutes: 0})  
})

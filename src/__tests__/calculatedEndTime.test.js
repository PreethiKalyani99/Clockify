import { calculateEndTime } from "../utils/calculateEndTime";

test("should calculate endTime and timeDuration when timeDuration's seconds is greater than 60", () => {
    const startDate = new Date('2024-05-01 12:00')
    startDate.setHours(135 + startDate.getHours(), 35 + startDate.getMinutes())
    expect(calculateEndTime(new Date('2024-05-01 12:00'), '135:34:77')).toStrictEqual({isValid: true, newEndTime: startDate, timeDuration: '135:35:17'})
})

test('should return the time as minutes when length of the time is 1', () => {
    const startDate = new Date('2024-05-01 12:00')
    startDate.setHours(0 + startDate.getHours(), 2 + startDate.getMinutes())
    expect(calculateEndTime(new Date('2024-05-01 12:00'),  '2')).toStrictEqual({isValid: true, newEndTime: startDate, timeDuration: '00:02:00'}) 
})

test('should return the time as minutes when length of the time is 2', () => {
    const startDate = new Date('2024-05-01 12:00')
    startDate.setHours(0 + startDate.getHours(), 12 + startDate.getMinutes())
    expect(calculateEndTime(new Date('2024-05-01 12:00'),  '12')).toStrictEqual({isValid: true, newEndTime: startDate, timeDuration: '00:12:00'}) 
})

test('should return first digit as hours and last 2 digits as minutes when length of the time is 3', () => {
    const startDate = new Date('2024-05-02 12:00') 
    startDate.setHours(1 + startDate.getHours(), 23 + startDate.getMinutes())
    expect(calculateEndTime(new Date('2024-05-02 12:00'),  '123')).toStrictEqual({isValid: true, newEndTime: startDate, timeDuration: '01:23:00'}) 
})

test('should return first 2 digits as hours and last 2 digits as minutes when length of the time is 4', () => {
    const startDate = new Date('2024-05-01 12:00')
    startDate.setHours(12 + startDate.getHours(), 34 + startDate.getMinutes())
    expect(calculateEndTime(new Date('2024-05-01 12:00'), '1234')).toStrictEqual({isValid: true, newEndTime: startDate, timeDuration: '12:34:00'})  
})
 
test('should return first 3 digits as hours and last 2 digits as minutes when length of the time is 5', () => {
    const startDate = new Date('2024-05-01 12:00')
    startDate.setHours(123 + startDate.getHours(), 45 + startDate.getMinutes())
    expect(calculateEndTime(new Date('2024-05-01 12:00'),  '12345')).toStrictEqual({isValid: true, newEndTime: startDate, timeDuration: '123:45:00'})  
})

test("should handle timeDuration when its hours is greater than 999 and calculate endTime", () => {
    const startDate = new Date('2024-05-01 12:00')
    startDate.setHours(999 + startDate.getHours(), 0 + startDate.getMinutes())
    expect(calculateEndTime(new Date('2024-05-01 12:00'), '123:99999:00')).toStrictEqual({isValid: true, newEndTime: startDate, timeDuration: '999:00:00'})  
})

test('should calculate endTime and timeDuration when timeDuration seconds is greater than 60', () => {
    const startDate = new Date('2024-05-01 12:00')
    startDate.setHours(69 + startDate.getHours(), 32 + startDate.getMinutes())
    expect(calculateEndTime(new Date('2024-05-01 12:00'), '45:12:0087656')).toStrictEqual({isValid: true, newEndTime: startDate, timeDuration: '69:32:56'})   
})

test('should return false when timeDuration is invalid (string)', () => {
    expect(calculateEndTime(new Date('2024-05-01 12:00'), 'dsajfhkjdf')).toStrictEqual({isValid: false})  
})

test('should return false when timeDuration is invalid (12:-4:6)', () => {
    const startDate = new Date('2024-05-01 12:00')
    startDate.setHours(999 + startDate.getHours(), 0 + startDate.getMinutes())
    expect(calculateEndTime(new Date('2024-05-01 12:00'), '12:-4:6')).toStrictEqual({isValid: false})  
})

test('should return timeDuration as it is when minutes and seconds are less than 60', () => {
    const startDate = new Date('2024-05-01 12:00')
    startDate.setHours(12 + startDate.getHours(), 45 + startDate.getMinutes())
    expect(calculateEndTime(new Date('2024-05-01 12:00'),  '12:45:30')).toStrictEqual({isValid: true, newEndTime: startDate, timeDuration: '12:45:30'})  
})

test('should return a number with colon on the right side as hours and calculate endTime and timeDuration', () => { 
    const startDate = new Date('2024-05-01 12:00')
    startDate.setHours(12 + startDate.getHours(), 0 + startDate.getMinutes())
    expect(calculateEndTime(new Date('2024-05-01 12:00'),  '12:')).toStrictEqual({isValid: true, newEndTime: startDate, timeDuration: '12:00:00'})  
})

test('should return a number with colon on the both side as minutes and calculate endTime and timeDuration', () => {
    const startDate = new Date('2024-05-01 12:00')
    startDate.setHours(0 + startDate.getHours(), 12 + startDate.getMinutes())
    expect(calculateEndTime(new Date('2024-05-01 12:00'),  ':12:')).toStrictEqual({isValid: true, newEndTime: startDate, timeDuration: '00:12:00'})  
}) 
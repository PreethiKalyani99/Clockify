import { calculateEndTime } from "../utils/calculateEndTime";

test('calculate end time when total time input change', () => {
    const startDate = new Date('2024-05-01 12:00')
    startDate.setHours(135 + startDate.getHours(), 35 + startDate.getMinutes())
    expect(calculateEndTime(new Date('2024-05-01 12:00'), '135:34:77')).toStrictEqual({isValid: true, newEndTime: startDate, timeDuration: '135:35:17'})
})

test('', () => {
    const startDate = new Date('2024-05-01 12:00')
    startDate.setHours(0 + startDate.getHours(), 12 + startDate.getMinutes())
    expect(calculateEndTime(new Date('2024-05-01 12:00'),  '12')).toStrictEqual({isValid: true, newEndTime: startDate, timeDuration: '00:12:00'}) 
})

test('', () => {
    const startDate = new Date('2024-05-01 12:00')
    startDate.setHours(12 + startDate.getHours(), 34 + startDate.getMinutes())
    expect(calculateEndTime(new Date('2024-05-01 12:00'), '1234')).toStrictEqual({isValid: true, newEndTime: startDate, timeDuration: '12:34:00'})  
})
 
test('', () => {
    const startDate = new Date('2024-05-01 12:00')
    startDate.setHours(123 + startDate.getHours(), 45 + startDate.getMinutes())
    expect(calculateEndTime(new Date('2024-05-01 12:00'),  '12345')).toStrictEqual({isValid: true, newEndTime: startDate, timeDuration: '123:45:00'})  
})

test('', () => {
    const startDate = new Date('2024-05-01 12:00')
    startDate.setHours(999 + startDate.getHours(), 0 + startDate.getMinutes())
    expect(calculateEndTime(new Date('2024-05-01 12:00'), '123456')).toStrictEqual({isValid: true, newEndTime: startDate, timeDuration: '999:00:00'})  
})

test('', () => {
    const startDate = new Date('2024-05-01 12:00')
    startDate.setHours(999 + startDate.getHours(), 0 + startDate.getMinutes())
    expect(calculateEndTime(new Date('2024-05-01 12:00'), '123:99999:00')).toStrictEqual({isValid: true, newEndTime: startDate, timeDuration: '999:00:00'})  
})

test('', () => {
    const startDate = new Date('2024-05-01 12:00')
    startDate.setHours(999 + startDate.getHours(), 0 + startDate.getMinutes())
    expect(calculateEndTime(new Date('2024-05-01 12:00'), '12334:12:00')).toStrictEqual({isValid: true, newEndTime: startDate, timeDuration: '999:00:00'})  
})

test('', () => {
    const startDate = new Date('2024-05-01 12:00')
    startDate.setHours(124 + startDate.getHours(), 39 + startDate.getMinutes())
    expect(calculateEndTime(new Date('2024-05-01 12:00'), '123:99:0045')).toStrictEqual({isValid: true, newEndTime: startDate, timeDuration: '124:39:45'})  
})

test('', () => {
    const startDate = new Date('2024-05-01 12:00')
    startDate.setHours(69 + startDate.getHours(), 32 + startDate.getMinutes())
    expect(calculateEndTime(new Date('2024-05-01 12:00'), '45:12:0087656')).toStrictEqual({isValid: true, newEndTime: startDate, timeDuration: '69:32:56'})   
})

test('', () => {
    expect(calculateEndTime(new Date('2024-05-01 12:00'), 'dsajfhkjdf')).toStrictEqual({isValid: false})  
})

test('', () => {
    const startDate = new Date('2024-05-01 12:00')
    startDate.setHours(999 + startDate.getHours(), 0 + startDate.getMinutes())
    expect(calculateEndTime(new Date('2024-05-01 12:00'), '12:-4:6')).toStrictEqual({isValid: true, newEndTime: startDate, timeDuration: '999:00:00'})  
})

test('', () => {
    const startDate = new Date('2024-05-01 12:00')
    startDate.setHours(12 + startDate.getHours(), 45 + startDate.getMinutes())
    expect(calculateEndTime(new Date('2024-05-01 12:00'),  '12:45:0')).toStrictEqual({isValid: true, newEndTime: startDate, timeDuration: '12:45:00'})  
})

test('', () => { 
    const startDate = new Date('2024-05-01 12:00')
    startDate.setHours(12 + startDate.getHours(), 0 + startDate.getMinutes())
    expect(calculateEndTime(new Date('2024-05-01 12:00'),  '12:')).toStrictEqual({isValid: true, newEndTime: startDate, timeDuration: '12:00:00'})  
})

test('', () => {
    const startDate = new Date('2024-05-01 12:00')
    startDate.setHours(999 + startDate.getHours(), 0 + startDate.getMinutes())
    expect(calculateEndTime(new Date('2024-05-01 12:00'), '1234:567:789')).toStrictEqual({isValid: true, newEndTime: startDate, timeDuration: '999:00:00'})  
})

test('', () => {
    const startDate = new Date('2024-05-01 12:00')
    startDate.setHours(0 + startDate.getHours(), 12 + startDate.getMinutes())
    expect(calculateEndTime(new Date('2024-05-01 12:00'),  ':12:')).toStrictEqual({isValid: true, newEndTime: startDate, timeDuration: '00:12:00'})  
}) 
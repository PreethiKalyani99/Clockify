import { calculateTimeDifference } from "../utils/calculateTimeDifference";

test('calculate time difference for given start and end time', () => {
    expect(calculateTimeDifference([12,30], [2,4])).toStrictEqual({hours: '13', minutes: '34'})
})

test('calculate time difference for given start and end time', () => {
    expect(calculateTimeDifference([12, 30], [10, 0])).toStrictEqual({hours: '21', minutes: '30'})
})

test('calculate time difference for given start and end time', () => {
    expect(calculateTimeDifference([0, 0], [0, 0])).toStrictEqual({hours: '00', minutes: '00'}) 
})

test('calculate time difference for given start and end time', () => {
    expect(calculateTimeDifference([0, 0], [21, 0])).toStrictEqual({hours: '21', minutes: '00'}) 
})

test('calculate time difference for given start and end time', () => { 
    expect(calculateTimeDifference([8, 0], [20, 16])).toStrictEqual({hours: '12', minutes: '16'}) 
})

test('calculate time difference for given start and end time', () => {
    expect(calculateTimeDifference([10, 20], [10, 20])).toStrictEqual({hours: '00', minutes: '00'})  
}) 

test('calculate time difference for given start and end time', () => {  
    expect(calculateTimeDifference([18, 0], [12, 0])).toStrictEqual({hours: '18', minutes: '00'}) 
})

test('calculate time difference for given start and end time', () => {
    expect(calculateTimeDifference([10, 0], [12, 0])).toStrictEqual({hours: '02', minutes: '00'}) 
})
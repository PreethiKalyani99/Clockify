import { calculateEndTime } from "../utils/calculateEndTime";

test('calculate end time when total time input change', () => {
    expect(calculateEndTime('12:00', '02:00', '135:34:77')).toStrictEqual({startTime: '12:00', endTime: "03:35", totalTime: "135:35:17", isValid: true})
})

test('', () => {
    expect(calculateEndTime('12:00','02:00',  '12')).toStrictEqual({startTime: '12:00', endTime: "12:12", totalTime: "00:12:00", isValid: true}) 
})

test('', () => {
    expect(calculateEndTime('12:00', '02:00', '1234')).toStrictEqual({startTime: '12:00', endTime: "00:34", totalTime: "12:34:00", isValid: true})  
})

test('', () => {
    expect(calculateEndTime('12:00', '02:00',  '12345')).toStrictEqual({startTime: '12:00', endTime: "15:45", totalTime: "123:45:00", isValid: true})  
})


test('', () => {
    expect(calculateEndTime('12:00', '02:00', '123456')).toStrictEqual({startTime: '12:00', endTime: "02:00", totalTime: "999:00:00", isValid: false})  
})

test('', () => {
    expect(calculateEndTime('12:00', '02:00', '123:99999:00')).toStrictEqual({startTime: '12:00', endTime: "02:00", totalTime: "999:00:00", isValid: false})  
})

test('', () => {
    expect(calculateEndTime('12:00', '02:00', '12334:12:00')).toStrictEqual({startTime: '12:00', endTime: "02:00", totalTime: "999:00:00", isValid: false})  
})

test('', () => {
    expect(calculateEndTime('12:00', '02:00', '123:99:0045')).toStrictEqual({startTime: '12:00', endTime: "16:39", totalTime: "124:39:45", isValid: true})  
})

test('', () => {
    expect(calculateEndTime('12:00', '02:00', '45:12:0087656')).toStrictEqual({startTime: '12:00', endTime: "09:32", totalTime: "69:32:56", isValid: true})   
})

test('', () => {
    expect(calculateEndTime('12:00', '02:00', 'dsajfhkjdf')).toStrictEqual({startTime: '12:00', endTime: "02:00", totalTime: "999:00:00", isValid: false})  
})

test('', () => {
    expect(calculateEndTime('12:00','02:00', '12:-4:6')).toStrictEqual({startTime: '12:00', endTime: "02:00", totalTime: "999:00:00", isValid: false})  
})

test('', () => {
    expect(calculateEndTime('12:00','02:00',  '12:45:0')).toStrictEqual({startTime: '12:00', endTime: "00:45", totalTime: "12:45:00", isValid: true})  
})

test('', () => { 
    expect(calculateEndTime('12:00','02:00',  '12:')).toStrictEqual({startTime: '12:00', endTime: "00:00", totalTime: "12:00:00", isValid: true})  
})

test('', () => {
    expect(calculateEndTime('12:00', '02:00', '1234:567:789')).toStrictEqual({startTime: '12:00', endTime: "02:00", totalTime: "999:00:00", isValid: false})  
})

test('', () => {
    expect(calculateEndTime('12:00','02:00',  ':12:')).toStrictEqual({startTime: '12:00', endTime: "12:12", totalTime: "00:12:00", isValid: true})  
}) 
import { calculateHMS } from "../utils/calculateHMS";

test('calculate given time to hours, minutes and seconds', () => {
    expect(calculateHMS("123:45:00")).toStrictEqual({totalTime: "123:45:00"})
}) 


test('calculate given time to hours, minutes and seconds', () => {
    expect(calculateHMS("12:76:89")).toStrictEqual({totalTime: "13:17:29"}) 
})

test('calculate given time to hours, minutes and seconds', () => {
    expect(calculateHMS("999:00:00")).toStrictEqual({totalTime: "999:00:00"}) 
})

test('calculate given time to hours, minutes and seconds', () => {
    expect(calculateHMS("123:456:78")).toStrictEqual({totalTime: "130:37:18"})   
})
import { inputDateTime } from "../utils/inputDateTime";

test('should return current date and time if no argument is passed', () => {
    const currentDate = new Date()

    const day = currentDate.getDay()
    const date = ('0' + currentDate.getDate()).slice(-2)
    const month = ('0' + (currentDate.getMonth() + 1)).slice(-2)
    const year = currentDate.getFullYear()
    const hours = ('0' + currentDate.getHours()).slice(-2)
    const minutes = ('0' + currentDate.getMinutes()).slice(-2)

    expect(inputDateTime()).toStrictEqual({day: day, date: date,  month: month, year: year, hrs: hours, mins: minutes, time: currentDate})
})

test('should return correct date and time for a given date string', () => {
    const dateString = '2024-04-23'

    const inputDate = new Date(dateString)
    const day = inputDate.getDay()
    const date = ('0' + inputDate.getDate()).slice(-2)
    const month = ('0' + (inputDate.getMonth() + 1)).slice(-2)
    const year = inputDate.getFullYear()
    const hours = ('0' + inputDate.getHours()).slice(-2)
    const minutes = ('0' + inputDate.getMinutes()).slice(-2)

    expect(inputDateTime(dateString)).toStrictEqual({day: day, date: date, month: month, year: year, hrs: hours, mins: minutes, time: inputDate}) 
})

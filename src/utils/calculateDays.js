export function calculateDays(startDate, endDate){
    const oneDay = 24 * 60 * 60 * 1000
    const days = Math.round(Math.abs((startDate - endDate) / oneDay))
    return days
}
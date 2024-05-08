const ONE_DAY = 24 * 60 * 60 * 1000

export function calculateDays(startDate, endDate){
    const startDateStartOfDay = new Date(startDate.toDateString());
    const endDateStartOfDay = new Date(endDate.toDateString());
    return Math.floor(Math.abs((startDateStartOfDay - endDateStartOfDay) / ONE_DAY))
}

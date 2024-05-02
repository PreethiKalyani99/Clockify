import { calculateDays } from "./calculateDays"

export function calculateEndDate(startDate, endDate, previousStartTime){
    const start = startDate, end = endDate, previousStart = previousStartTime

    if(previousStart.toISOString().split('T')[0] !== end.toISOString().split('T')[0]){
        console.log(start, end, "start end date comparison", previousStartTime)
        const days = calculateDays(previousStart, end)
        end.setDate(start.getDate() + days)
        console.log(end, "days added end")
        return end
    }
    if(start.getHours() > endDate.getHours()){
        end.setFullYear(start.getFullYear(), start.getMonth(), start.getDate() + 1)
        return end
    }
    else{
        end.setFullYear(start.getFullYear(), start.getMonth(), start.getDate())
        return end
    }
}
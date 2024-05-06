import { calculateDays } from "./calculateDays"

export function calculateEndDate(startDate, endDate, previousStartDate){
    const days = calculateDays(previousStartDate, endDate)
    let end = new Date(endDate)

    if(days === 0){
        end.setFullYear(startDate.getFullYear(),(startDate.getMonth()).toString().padStart(2,'0'),startDate.getDate().toString().padStart(2,'0'))
        return end
    }
    else{
        end.setDate(startDate.getDate() + days)
        return end
    }
}
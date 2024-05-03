
export function calculateEndDate(startDate, endDate, previousStartDate){
    console.log(startDate, endDate, previousStartDate, "end date inputs")
    let end = new Date(endDate)
    if(previousStartDate.getHours() > end.getHours() && (Math.abs(previousStartDate.getDate() - end.getDate()) === 1)){
        console.log("condition true")
        end.setDate(startDate.getDate() + 1)
        return end
    }
    console.log("condition false")
    end.setFullYear(startDate.getFullYear(),(startDate.getMonth()).toString().padStart(2,'0'),startDate.getDate().toString().padStart(2,'0'))
    return end
}
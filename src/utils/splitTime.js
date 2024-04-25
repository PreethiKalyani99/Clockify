export function splitTime(time, symbol){
    return time.split(symbol.toString()).map(Number)
}
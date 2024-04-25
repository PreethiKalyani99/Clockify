export function stringPadStart(value, length, valueToReplace){
    return value.toString().padStart(length, valueToReplace.toString())
}
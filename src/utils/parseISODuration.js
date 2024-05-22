export function parseISODuration(duration) {
  if (duration === null) {
    return '00:00:00'
  }

  const regex = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/
  const matches = duration.match(regex)
  if(matches){
    const hours = matches[1] ?? '0'
    const minutes = matches[2] ?? '0'
    const seconds = matches[3] ?? '0'
  
    return `${hours.toString().padStart(2,'0')}:${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`
  }
  return '00:00:00'
}


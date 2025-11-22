export function formatTo12Hour(hour24: string) {
  const [hh, mm] = hour24.split(':').map(Number)
  const period = hh >= 12 ? 'PM' : 'AM'
  const hour12 = hh % 12 === 0 ? 12 : hh % 12
  return `${hour12}:${mm.toString().padStart(2, '0')} ${period}`
}
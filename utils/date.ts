export function startOfDay(date: Date) {
  const newDate = new Date(date)
  newDate.setHours(0, 0, 0, 0)
  return newDate
}


export const dayOfWeekMap: Record<string, number> = {
  SUNDAY: 0,
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
}

console.log(startOfDay(new Date('2005-10-10')))

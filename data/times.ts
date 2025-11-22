import { formatTo12Hour } from "../utils/formatTime";


export const times: { label: string; value: string }[] = []

for (let hour = 6; hour <= 24; hour++) {
  for (const min of [0, 30]) {
    const hh = hour.toString().padStart(2, '0')
    const mm = min.toString().padStart(2, '0')
    const value = `${hh}:${mm}` 
    const label = formatTo12Hour(value) 
    times.push({ value, label })
  }
}

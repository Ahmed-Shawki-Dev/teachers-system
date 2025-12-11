// utils/formatTime.ts

/**
 * دالة لتنسيق الوقت بذكاء
 * بتقبل نص (مثلاً "14:30") أو تاريخ (Date object)
 * وبترجع الوقت بصيغة 12 ساعة (02:30 PM)
 */
export const formatTo12Hour = (time: string | Date | null | undefined): string => {
  if (!time) return ''

  // 1. لو الوقت جاي كـ نص "HH:mm" (مثلاً "16:00")
  if (typeof time === 'string') {
    // نتأكد إنه بصيغة الوقت المعروفة
    if (time.includes(':')) {
      const [hoursStr, minutesStr] = time.split(':')
      let hours = parseInt(hoursStr, 10)
      const minutes = parseInt(minutesStr, 10)

      // التأكد من صحة الأرقام
      if (isNaN(hours) || isNaN(minutes)) return time

      const ampm = hours >= 12 ? 'PM' : 'AM'
      hours = hours % 12
      hours = hours ? hours : 12 // الساعة 0 تبقى 12

      // إضافة صفر على الشمال للدقائق لو رقم واحد
      const strMinutes = minutes < 10 ? '0' + minutes : minutes

      return `${hours}:${strMinutes} ${ampm}`
    }
    // لو نص غريب رجعه زي ما هو
    return time
  }

  // 2. لو الوقت جاي كـ Date object
  if (time instanceof Date) {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
      timeZone: 'Africa/Cairo', // إجبار توقيت مصر
    }).format(time)
  }

  return ''
}

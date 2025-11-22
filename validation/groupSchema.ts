import * as z from 'zod'

// نفس الـ Enum اللي في الداتا بيز عشان الـ Validation
export enum DayOfWeek {
  SUNDAY = 'SUNDAY',
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
}

const scheduleItemSchema = z.object({
  dayOfWeek: z.nativeEnum(DayOfWeek).refine((v) => Object.values(DayOfWeek).includes(v), {
    message: 'اختر يوماً صحيحاً',
  }),

  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'صيغة الوقت غير صحيحة (HH:MM)'),

  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'صيغة الوقت غير صحيحة (HH:MM)'),
})

export const groupSchema = z.object({
  name: z.string().min(2, 'اسم المجموعة لازم يكون على الأقل حرفين').max(50, 'الاسم طويل أوي'),
  // بنقوله إن الجروب ممكن يكون معاه قايمة مواعيد (اختياري أو إجباري براحتك)
  schedule: z.array(scheduleItemSchema).optional(),
})

export type IGroup = z.infer<typeof groupSchema>

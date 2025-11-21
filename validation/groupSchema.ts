// lib/validations/student.ts
import * as z from 'zod'

export const groupSchema = z.object({
  name: z.string().min(2, 'اسم المجموعة لازم يكون على الأقل حرفين').max(50, 'الاسم طويل أوي'),
})

export type IGroup = z.infer<typeof groupSchema>

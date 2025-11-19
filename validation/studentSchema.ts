// lib/validations/student.ts
import * as z from 'zod'

export const studentSchema = z.object({
  name: z.string().min(2, 'اسم الطالب لازم يكون على الأقل حرفين').max(50, 'الاسم طويل أوي'),

  parentPhone: z
    .string()
    .regex(/^01[0125][0-9]{8}$/, 'رقم ولي الأمر لازم يكون مصري صحيح (مثل: 01012345678)')
    .length(11, 'الرقم لازم يكون 11 رقم بالظبط'),

  parentName: z.string().min(2, 'اسم ولي الأمر لازم يكون على الأقل حرفين'),

  gender: z.enum(['ذكر', '', 'أنثى']),
})

export type IStudent = z.infer<typeof studentSchema>

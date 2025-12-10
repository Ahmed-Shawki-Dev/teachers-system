import * as z from 'zod'

export const studentSchema = z.object({
  name: z
    .string()
    .min(2, 'الاسم يجب أن يتكون من حرفين على الأقل')
    .max(50, 'الاسم يتجاوز الحد المسموح (50 حرف)'),

  parentPhone: z
    .string()
    .regex(/^01[0125][0-9]{8}$/, 'رقم الهاتف غير صحيح، يجب أن يبدأ بـ 01 ويتكون من 11 رقم')
    .length(11, 'رقم الهاتف يجب أن يتكون من 11 رقم'),

  groupId: z.string().min(1, 'يرجى اختيار المجموعة الدراسية'),
})

export type IStudent = z.infer<typeof studentSchema>

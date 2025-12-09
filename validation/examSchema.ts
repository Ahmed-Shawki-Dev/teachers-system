import { z } from 'zod'

export const examSchema = z.object({
  title: z.string().min(2, 'اسم الامتحان لازم يكون حرفين على الأقل'),

  date: z.coerce
    .date()
    .refine((date) => !isNaN(date.getTime()), { message: 'تاريخ الامتحان مطلوب' }),

  maxScore: z.coerce.number().min(1, 'الدرجة العظمى لازم تكون أكبر من صفر'),

  groupId: z.string().min(1, 'المجموعة مطلوبة'),
})

export type IExam = z.infer<typeof examSchema>

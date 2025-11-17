import * as z from 'zod'

export const teacherSchema = z.object({
  name: z.string().min(2, 'الأسم لازم عالأقل حرفين'),
  email: z.string().email('الإيميل مش صح'),
  password: z.string().min(8, 'كلمة السر لازم تكون أكتر من 8 حروف'),
  phone: z
    .string()
    .regex(/^01[0125][0-9]{8}$/, {
      message: 'رقم الموبايل لازم يكون مصري صحيح (مثلاً 01012345678)',
    })
    .min(11, 'الرقم لازم يكون 11 رقم')
    .max(11, 'الرقم لازم يكون 11 رقم'),
  bio: z.string().min(10, 'لازم تكتب عالأقل 10 حروف').max(500, 'البايو ما يعديش 500 حرف'),
})

export type ITeacher = z.infer<typeof teacherSchema>

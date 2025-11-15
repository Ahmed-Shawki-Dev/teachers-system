import * as z from 'zod'

export const teacherSchema = z.object({
  name: z.string().min(2, 'الأسم لازم عالأقل حرفين'),
  email: z.string().email('الإيميل مش صح'),
  password: z.string().min(8, 'كلمة السر لازم تكون أكتر من 8 حروف'),
})

export type ITeacher = z.infer<typeof teacherSchema>
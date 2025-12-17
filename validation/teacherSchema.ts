import * as z from 'zod'

export const teacherSchema = z.object({
  name: z.string().min(3, 'الاسم يجب أن يكون 3 أحرف على الأقل'),
  email: z.string().email('بريد إلكتروني غير صالح'),
  password: z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
  bio: z.string().optional(),
  phone: z.string().min(10, 'رقم الهاتف غير صالح'),
  avatarUrl: z.string().optional(),

  // ✅ هنا الحل: coerce بتحول أي حاجة لرقم غصب عنها
  maxStudents: z.coerce.number().min(1, 'يجب أن يكون هناك طالب واحد على الأقل').default(200),

  // ✅ التأكد من الباقة
  tier: z.enum(['BASIC', 'PRO']).default('BASIC'),

  // ✅ التأكد من الباركود
  hasBarcodeScanner: z.boolean().default(false).optional(),
})

export type ITeacher = z.infer<typeof teacherSchema>

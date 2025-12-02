import * as z from 'zod'

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'مطلوب إدخال كلمة المرور الحالية'),

    newPassword: z.string().min(8, 'كلمة المرور الجديدة يجب أن تكون 8 أحرف على الأقل'),

    confirmPassword: z.string().min(1, 'مطلوب تأكيد كلمة المرور الجديدة'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'كلمتا المرور غير متطابقتين',
    path: ['confirmPassword'],
  })

export type IChangePassword = z.infer<typeof changePasswordSchema>

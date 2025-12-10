import z from 'zod'

export const LoginSchema = z.object({
  email: z.string().email({
    message: 'البريد الإلكتروني غير صالح',
  }),
  password: z.string().min(8, {
    message: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل',
  }),
})

export type ILogin = z.infer<typeof LoginSchema>
